use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::Manager;


#[derive(Serialize, Deserialize, Debug, Default)]
pub struct AppConfig {
    pub last_workspace: Option<String>
}

fn config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    Ok(dir.join("app_config.json"))
}

pub fn load_config(app: &tauri::AppHandle) -> AppConfig {
    let path = match config_path(app) {
        Ok(p) => p,
        Err(_) => return AppConfig::default(),
    };

    let content = match fs::read_to_string(&path) {
        Ok(c) => c,
        Err(_) => return AppConfig::default(),
    };

    serde_json::from_str(&content).unwrap_or_default()
}

pub fn save_config(app: &tauri::AppHandle, config: &AppConfig) -> Result<(), String> {
    let path = config_path(app)?;
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_last_workspace(app: tauri::AppHandle) -> Option<String> {
    load_config(&app).last_workspace
}