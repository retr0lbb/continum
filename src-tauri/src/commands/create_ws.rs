use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use crate::DialogState;
use crate::commands::app_config::{save_config, AppConfig};

#[derive(Serialize, Deserialize, Debug)]
pub struct WorkspaceConfig {
    pub path: String,
    pub last_opened: String,
}

#[tauri::command]
pub async fn select_workspace(app: tauri::AppHandle) -> Result<Option<WorkspaceConfig>, String> {
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

    app.state::<DialogState>().0.lock().unwrap().clone_from(&false);

    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }

    let folder_path = match folder {
        None => return Ok(None),
        Some(p) => p,
    };

    let config = create_or_update_workspace(&folder_path)?;

    // Salva no app_config para lembrar na próxima vez
    save_config(&app, &AppConfig {
        last_workspace: Some(folder_path),
    })?;

    Ok(Some(config))
}

pub fn create_or_update_workspace(folder_path: &str) -> Result<WorkspaceConfig, String> {
    let config_path = Path::new(folder_path).join("workspace.json");
    let now = chrono::Utc::now().to_rfc3339();

    let config = WorkspaceConfig {
        path: folder_path.to_string(),
        last_opened: now,
    };

    let json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(&config_path, json)
        .map_err(|e| format!("Erro ao salvar workspace.json: {}", e))?;

    Ok(config)
}