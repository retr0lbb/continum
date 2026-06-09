use std::{fs, path::Path};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TaskStatus {
    Todo,
    Doing,
    Done
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub title: String,
    pub status: TaskStatus
}

#[tauri::command]
pub fn read_project_tasks(projectPath: String)-> Result<Vec<Task>, String>{
    let path = Path::new(&projectPath).join(".continum/tasks.md");

    if !path.exists(){
        return Err("Tasks File not found".to_string());
    }

    let content = fs::read_to_string(&path).map_err(|e| format!("Erro ao ler tasks.md: {}", e))?;

    let mut tasks: Vec<Task> = Vec::new();
    let mut current_status  = TaskStatus::Todo;

    for line in content.lines(){
        let line = line.trim();

        match line {
            "# Todo" => {current_status = TaskStatus::Todo},
            "# Doing" => {current_status = TaskStatus::Doing},
            "# Done" => {current_status = TaskStatus::Done},
            _ => {}
        }

        if line.starts_with("- [ ]") || line.starts_with("- [x]"){
            let title = line[5..].trim().to_string();
            if !title.is_empty(){
                tasks.push(Task {title, status: current_status.clone()});
            }
        }
    }



    Ok(tasks)

}

#[tauri::command]
pub fn save_project_tasks(project_path: String, tasks: Vec<Task>) -> Result<(), String>{
    let path = Path::new(&project_path).join(".continum/tasks.md");

    if !path.exists(){
        return Err("Tasks File not found".to_string());
    }

    let mut todo: Vec<Task> = Vec::new();
    let mut doing: Vec<Task> = Vec::new();
    let mut done: Vec<Task> = Vec::new();

    let mut content = String::new();

    for task in tasks{
        match task.status {
            TaskStatus::Doing => doing.push(task),
            TaskStatus::Done => done.push(task),
            TaskStatus::Todo => todo.push(task),
        }
    }

    content.push_str("# Todo\n");
    for t in &todo  { content.push_str(&format!("- [ ] {}\n", t.title)); }

    content.push_str("# Doing\n");
    for t in &doing  { content.push_str(&format!("- [ ] {}\n", t.title)); }

    content.push_str("# Done\n");
    for t in &done  { content.push_str(&format!("- [x] {}\n", t.title)); }

    fs::write(&path, content)
        .map_err(|e| format!("Erro ao salvar tasks.md: {}", e))?;

    Ok(())
}