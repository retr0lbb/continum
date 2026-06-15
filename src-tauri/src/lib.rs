use std::sync::Mutex;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager,
};

use crate::{setup::move_window::position_window_bottom_right, utils::shortcut};

pub mod commands;
pub mod setup;
pub mod utils;
pub mod types;

#[derive(Default)]
pub struct DialogState(Mutex<bool>);

#[derive(Default)]
pub struct TogglingState(pub Mutex<bool>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Sem Arc aqui, o .manage() cuida do compartilhamento
    tauri::Builder::default()
        .manage(DialogState::default())
        .manage(TogglingState::default())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(debug_assertions)]
            window.open_devtools();

            let show = MenuItem::with_id(app, "show", "Abrir", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Sair", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    "quit" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.close();
                        }
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            position_window_bottom_right(&window)?;

            let event_window = window.clone();
            let app_handle = app.handle().clone(); // <- para acessar o estado

            window.on_window_event(move |event| {
                if let tauri::WindowEvent::Focused(false) = event {
                    let state = app_handle.state::<DialogState>();
                    let toggling = app_handle.state::<TogglingState>();

                    let dialog_aberto = *state.0.lock().unwrap();
                    let is_toggling = *toggling.0.lock().unwrap();

                    if !dialog_aberto && !is_toggling {
                        event_window.hide().unwrap();
                    }
                }
            });


            let _ = shortcut::ShortcutBuilder::new(app).add("Ctrl+Shift+O", |app| {
                if let Some(window) = app.get_webview_window("main") {
                    if window.is_visible().unwrap_or(false) {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
            }).register().map_err(|e| e.to_string());


            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            commands::create_ws::select_workspace,
            commands::load_workspace::load_workspace,
            commands::load_workspace::get_repositories,
            commands::app_config::get_last_workspace,
            commands::init_project::init_project,
            commands::init_project::open_project,
            commands::sessions::open_ws_session,
            commands::sessions::close_ws_session,
            commands::sessions::open_project_session,
            commands::sessions::close_project_session,
            commands::tasks::save_project_tasks,
            commands::tasks::read_project_tasks,
            commands::notes::read_project_notes,
            commands::notes::save_project_notes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}