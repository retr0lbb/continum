use std::{fs, path::Path};
use crate::types::Session;

pub fn open_session(sessions_path: &Path) -> Result<(), String> {
    let now = chrono::Utc::now().to_rfc3339();
    let mut sessions = read_sessions(sessions_path).unwrap_or_default();
    sessions.push(Session { start: now, end: None });
    let json = serde_json::to_string_pretty(&sessions).map_err(|e| e.to_string())?;
    fs::write(sessions_path, json)
        .map_err(|e| format!("Erro ao salvar sessão: {}", e))?;
    Ok(())
}

pub fn close_session(sessions_path: &Path) -> Result<(), String> {
    let mut sessions = read_sessions(sessions_path).unwrap_or_default();
    if let Some(session) = sessions.iter_mut().rev().find(|s| s.end.is_none()) {
        session.end = Some(chrono::Utc::now().to_rfc3339());
    }
    let json = serde_json::to_string_pretty(&sessions).map_err(|e| e.to_string())?;
    fs::write(sessions_path, json)
        .map_err(|e| format!("Erro ao fechar sessão: {}", e))?;
    Ok(())
}

pub fn read_sessions(sessions_path: &Path) -> Result<Vec<Session>, String> {
    if !sessions_path.exists() {
        return Ok(vec![]);
    }
    let content = fs::read_to_string(sessions_path)
        .map_err(|e| format!("Erro ao ler sessões: {}", e))?;
    serde_json::from_str(&content).map_err(|e| format!("Sessões inválidas: {}", e))
}

// Workspace — salva na raiz do workspace
#[tauri::command]
pub fn open_ws_session(ws_path: &str) -> Result<(), String> {
    let path = Path::new(ws_path).join("sessions.json");
    open_session(&path)
}

#[tauri::command]
pub fn close_ws_session(ws_path: &str) -> Result<(), String> {
    let path = Path::new(ws_path).join("sessions.json");
    close_session(&path)
}

#[tauri::command]
pub fn open_project_session(project_path: &str) -> Result<(), String> {
    let path = Path::new(project_path).join(".continum/sessions.json");
    open_session(&path)
}

#[tauri::command]
pub fn close_project_session(project_path: &str) -> Result<(), String> {
    let path = Path::new(project_path).join(".continum/sessions.json");
    close_session(&path)
}