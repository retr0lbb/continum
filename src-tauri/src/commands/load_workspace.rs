use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};


use crate::commands::{app_config::{AppConfig, save_config}, create_ws::{WorkspaceConfig, create_or_update_workspace}};

#[derive(Serialize, Deserialize, Debug)]
pub struct ProjectInfo{
    pub name: String,
    pub path: String,
    pub initialized: bool,
    pub last_opened: Option<String>
}

#[tauri::command]
pub fn load_workspace(app: tauri::AppHandle, path: String) -> Result<WorkspaceConfig, String> {
    let config_path = Path::new(&path).join("workspace.json");

    if !config_path.exists() {
        return Err(format!("workspace.json não encontrado em: {}", path));
    }

    let config = create_or_update_workspace(&path)?;

    save_config(&app, &AppConfig {
        last_workspace: Some(path.clone()),
    })?;

    Ok(config)
}

#[tauri::command]
pub async fn get_repositories(ws_path: String) -> Result<Vec<ProjectInfo>, String>{
    let entries: fs::ReadDir = fs::read_dir(&ws_path)
        .map_err(|e| format!("Erro ao ler workspace: {}", e))?;

    let mut repos = Vec::new();

    for entry in entries{
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;

        if !metadata.is_dir() {
            continue;
        }

        let name = entry.file_name().to_string_lossy().to_string();

        if name.starts_with("."){
            continue;
        }

        let path = entry.path().to_string_lossy().to_string();

        let continum_dir = Path::new(&path).join(".continum");
        let initialized = continum_dir.exists();

        let last_opened = if initialized{
            let project_path = continum_dir.join("project.json");
            fs::read_to_string(&project_path).ok().and_then(|content| {
                serde_json::from_str::<serde_json::Value>(&content).ok()
            }).and_then(|json| {
                json["last_opened"].as_str().map(|s| s.to_string())
            })
        } else {
            None
        };

        repos.push(ProjectInfo {name, path, initialized, last_opened});
    }

    Ok(repos)
}