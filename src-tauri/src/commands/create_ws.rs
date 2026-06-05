use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use crate::DialogState;

#[derive(Serialize, Deserialize, Debug)]
pub struct WorkspaceItem {
    pub name: String,
    pub path: String,
    pub num_tasks: usize,
    pub last_session: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WorkspaceConfig {
    pub items: Vec<WorkspaceItem>,
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

    let config_path = Path::new(&folder_path).join("workspace.json");

    let config = if config_path.exists() {
        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Erro ao ler workspace.json: {}", e))?;
        serde_json::from_str::<WorkspaceConfig>(&content)
            .map_err(|e| format!("workspace.json inválido: {}", e))?
    } else {
        let new_config = WorkspaceConfig { items: vec![] };
        let json = serde_json::to_string_pretty(&new_config)
            .map_err(|e| e.to_string())?;
        fs::write(&config_path, json)
            .map_err(|e| format!("Erro ao criar workspace.json: {}", e))?;
        new_config
    };

    Ok(Some(config))
}