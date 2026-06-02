use tauri::{
    Manager, PhysicalPosition, menu::{Menu, MenuItem}, tray::TrayIconBuilder
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Esconde ao iniciar
            window.hide()?;

            let show = MenuItem::with_id(
                app,
                "show",
                "Abrir",
                true,
                None::<&str>,
            )?;

            let quit = MenuItem::with_id(
                app,
                "quit",
                "Sair",
                true,
                None::<&str>,
            )?;

            let menu = Menu::with_items(
                app,
                &[&show, &quit]
            )?;

            TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            let window =
                                app.get_webview_window("main").unwrap();

                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }

                        "quit" => {
                            app.exit(0);
                        }

                        _ => {}
                    }
                })
                .build(app)?;

                let monitor = window.current_monitor()?.unwrap();
                
                let monitor_size = monitor.size();

                let window_size = window.outer_size()?;

                let x = monitor_size.width as i32 - window_size.width as i32 - 20;
                let y = monitor_size.height as i32 - window_size.height as i32 - 60;

                window.set_position(
                    PhysicalPosition::new(x, y)
                )?;

                let event_window = window.clone();

                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::Focused(false) = event {
                        event_window.hide().unwrap();
                    }
                });

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}