// src/types.rs
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Session {
    pub start: String,
    pub end: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WorkspaceConfig {
    pub path: String,
    pub last_opened: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ProjectJson {
    pub name: String,
    pub path: String,
    pub description: String,
    pub created_at: String,
    pub last_opened: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ProjectInfo {
    pub name: String,
    pub path: String,
    pub initialized: bool,
    pub last_opened: Option<String>,
}

