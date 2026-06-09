export interface WorkspaceConfig {
    path: string;
    last_opened: string;
}

export interface ProjectInfo {
    name: string;
    path: string;
    initialized: boolean;
    last_opened: string | null;
}


export interface Project {
    name: string,
    path: string,
    description: string,
    created_at: string,
    last_opened: string,
}