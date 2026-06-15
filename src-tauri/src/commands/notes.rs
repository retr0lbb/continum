use std::{fs, path::Path};
use serde::{Deserialize, Serialize};


#[tauri::command]
pub fn read_project_notes(project_path: String)-> Result<String, String>{
    let path = Path::new(&project_path).join(".continum/notes.md");

    if !path.exists(){
        return Err("Tasks File not found".to_string());
    }

    let content = fs::read_to_string(&path).map_err(|e| format!("Erro ao ler tasks.md: {}", e))?;

    Ok(content)
}

#[tauri::command]
pub fn save_project_notes(project_path: String, note: String) -> Result<(), String>{
    let path = Path::new(&project_path).join(".continum/notes.md");

    if !path.exists(){
        return Err("Tasks File not found".to_string());
    }

    fs::write(&path, note)
        .map_err(|e| format!("Erro ao salvar tasks.md: {}", e))?;

    Ok(())
}