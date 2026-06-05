use std::fs;
use std::sync::Mutex; // <- tira o Arc, não precisa mais
use serde::Serialize;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, PhysicalPosition,
};
use tauri_plugin_dialog::DialogExt;

#[derive(Serialize)]
struct FolderEntry {
    name: String,
    path: String,
}

#[derive(Default)]
struct DialogState(Mutex<bool>);

#[tauri::command]
async fn select_workspace(
    app: tauri::AppHandle,
) -> Result<Option<String>, String> {
    // Acende a flag via app handle
    app.state::<DialogState>().0.lock().unwrap().clone_from(&true);

    let app_clone = app.clone();
    let folder = tauri::async_runtime::spawn_blocking(move || {
        app_clone
            .dialog()
            .file()
            .set_title("Select Workspace")
            .blocking_pick_folder()
            .map(|path| path.to_string())
    })
    .await
    .map_err(|e| e.to_string())?;

    // Apaga a flag
    app.state::<DialogState>().0.lock().unwrap().clone_from(&false);

    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }

    println!("Selected folder: {:?}", folder);
    Ok(folder)
}

#[tauri::command]
fn list_workspace_folders(workspace_path: String) -> Result<Vec<FolderEntry>, String> {
    let entries = fs::read_dir(&workspace_path)
        .map_err(|e| format!("Failed to read directory '{}': {}", workspace_path, e))?;

    let mut folders = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;

        if metadata.is_dir() {
            let name = entry.file_name().to_string_lossy().to_string();
            let path = entry.path().to_string_lossy().to_string();
            folders.push(FolderEntry { name, path });
        }
    }

    Ok(folders)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Sem Arc aqui, o .manage() cuida do compartilhamento
    tauri::Builder::default()
        .manage(DialogState::default()) // <- registra o estado global
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.hide()?;

            let show = MenuItem::with_id(app, "show", "Abrir", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Sair", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;

            TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            let monitor = window.current_monitor()?.unwrap();
            let monitor_size = monitor.size();
            let window_size = window.outer_size()?;
            let x = monitor_size.width as i32 - window_size.width as i32 - 20;
            let y = monitor_size.height as i32 - window_size.height as i32 - 60;
            window.set_position(PhysicalPosition::new(x, y))?;

            let event_window = window.clone();
            let app_handle = app.handle().clone(); // <- para acessar o estado

            window.on_window_event(move |event| {
                if let tauri::WindowEvent::Focused(false) = event {
                    let state = app_handle.state::<DialogState>();
                    let dialog_aberto = *state.0.lock().unwrap();
                    if !dialog_aberto {
                        event_window.hide().unwrap();
                    }
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            select_workspace,
            list_workspace_folders
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}