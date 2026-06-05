import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export interface WorkspaceItem {
    name: string;
    path: string;
}

export interface WorkspaceConfig {
    path: string;
    items: WorkspaceItem[];
}

export function useWorkspace() {
    const [workspace, setWorkspace] = useState<WorkspaceConfig | null>(null);
    const [loading, setLoading] = useState(false);

    async function selectWorkspace() {
        try {
            setLoading(true);
            const path = await invoke<WorkspaceConfig | null>("select_workspace");
            setWorkspace(path);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return { workspace, loading, selectWorkspace };
}