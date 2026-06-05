use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ProjectJson {
    pub name: String,
    pub path: String,
    pub description: String,
    pub created_at: String,
    pub last_opened: String,
}

#[tauri::command]
pub fn init_project(path: String) -> Result<ProjectJson, String> {
    let project_dir = Path::new(&path);

    if !project_dir.exists() {
        return Err(format!("Diretório não encontrado: {}", path));
    }

    let continum_dir = project_dir.join(".continum");

    if continum_dir.exists() {
        return Err("Projeto já inicializado".to_string());
    }

    fs::create_dir_all(&continum_dir)
        .map_err(|e| format!("Erro ao criar .continum: {}", e))?;

    let name = project_dir
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    let now = chrono::Utc::now().to_rfc3339();

    let project = ProjectJson {
        name: name.clone(),
        path: path.clone(),
        description: String::new(),
        created_at: now.clone(),
        last_opened: now,
    };

    let json = serde_json::to_string_pretty(&project)
        .map_err(|e| e.to_string())?;

    fs::write(continum_dir.join("project.json"), json)
        .map_err(|e| format!("Erro ao criar project.json: {}", e))?;

    fs::write(
        continum_dir.join("tasks.md"),
        format!("# Tasks — {}\n\n- [ ] \n", name),
    ).map_err(|e| format!("Erro ao criar tasks.md: {}", e))?;

    fs::write(
        continum_dir.join("notes.md"),
        format!("# Notes — {}\n\n", name),
    ).map_err(|e| format!("Erro ao criar notes.md: {}", e))?;

    Ok(project)
}

#[tauri::command]
pub fn open_project(path: String) -> Result<ProjectJson, String> {
    let continum_dir = Path::new(&path).join(".continum");

    if !continum_dir.exists() {
        return Err("Projeto não inicializado".to_string());
    }

    let project_path = continum_dir.join("project.json");

    let content = fs::read_to_string(&project_path)
        .map_err(|e| format!("Erro ao ler project.json: {}", e))?;

    let mut project = serde_json::from_str::<ProjectJson>(&content)
        .map_err(|e| format!("project.json inválido: {}", e))?;

    // Atualiza last_opened
    project.last_opened = chrono::Utc::now().to_rfc3339();

    let json = serde_json::to_string_pretty(&project)
        .map_err(|e| e.to_string())?;

    fs::write(&project_path, json)
        .map_err(|e| format!("Erro ao salvar project.json: {}", e))?;

    Ok(project)
}