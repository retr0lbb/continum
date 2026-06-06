// src/shortcuts.rs
use tauri::Manager;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

pub struct ShortcutBuilder<'a> {
    app: &'a tauri::App,
    shortcuts: Vec<(&'static str, Box<dyn Fn(&tauri::AppHandle) + Send + Sync + 'static>)>,
}

impl<'a> ShortcutBuilder<'a> {
    pub fn new(app: &'a tauri::App) -> Self {
        Self { app, shortcuts: Vec::new() }
    }

    pub fn add(mut self, keys: &'static str, action: impl Fn(&tauri::AppHandle) + Send + Sync + 'static) -> Self {
        self.shortcuts.push((keys, Box::new(action)));
        self
    }

    pub fn register(self) -> Result<(), Box<dyn std::error::Error>> {
        for (keys, action) in self.shortcuts {
            let shortcut: Shortcut = keys.parse()?;
            self.app.global_shortcut().on_shortcut(shortcut, move |app, _s, event| {
                if event.state() == ShortcutState::Pressed {
                    action(app.app_handle());
                }
            })?;
        }
        Ok(())
    }
}