use serde::Serialize;
use std::fs;

#[derive(Serialize)]
pub struct FolderEntry {
    pub name: String,
    pub path: String,
}

#[tauri::command]
pub fn list_workspace_folders(workspace_path: String) -> Result<Vec<FolderEntry>, String> {
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
