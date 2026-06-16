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

#[tauri::command]
pub fn create_project_folder(path: String, name: String) -> Result<ProjectJson, String> {
    let project_dir = Path::new(&path).join(&name);

    if project_dir.exists() {
        return Err(format!("Já existe um projeto com o nome '{}'", name));
    }

    fs::create_dir_all(&project_dir)
        .map_err(|e| format!("Erro ao criar pasta do projeto: {}", e))?;

    let path = project_dir.to_string_lossy().to_string();

    // Reutiliza o init_project para criar o .continum e os arquivos
    init_project(path)
}

#[tauri::command]
pub fn rename_project_folder(project_path: String, new_name: String) -> Result<ProjectJson, String> {
    let project_dir = Path::new(&project_path);

    if !project_dir.exists() {
        return Err(format!("Projeto não encontrado: {}", project_path));
    }

    let parent = project_dir
        .parent()
        .ok_or("Erro ao obter pasta pai")?;

    let new_dir = parent.join(&new_name);

    if new_dir.exists() {
        return Err(format!("Já existe um projeto com o nome '{}'", new_name));
    }

    fs::rename(&project_dir, &new_dir)
        .map_err(|e| format!("Erro ao renomear pasta: {}", e))?;

    let new_path = new_dir.to_string_lossy().to_string();
    let continum_dir = new_dir.join(".continum");
    let project_file = continum_dir.join("project.json");

    // Atualiza o project.json com o novo nome e path
    let content = fs::read_to_string(&project_file)
        .map_err(|e| format!("Erro ao ler project.json: {}", e))?;

    let mut project = serde_json::from_str::<ProjectJson>(&content)
        .map_err(|e| format!("project.json inválido: {}", e))?;

    project.name = new_name;
    project.path = new_path;

    let json = serde_json::to_string_pretty(&project)
        .map_err(|e| e.to_string())?;

    fs::write(&project_file, json)
        .map_err(|e| format!("Erro ao salvar project.json: {}", e))?;

    Ok(project)
}