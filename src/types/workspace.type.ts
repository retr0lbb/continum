export interface WorkspaceItem {
    name: string;
    path: string;
}

export interface WorkspaceConfig {
    path: string;
    items: WorkspaceItem[];
}