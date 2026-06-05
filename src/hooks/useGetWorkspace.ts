import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

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
    const [loading, setLoading] = useState(true);

    // Ao montar, tenta carregar o último workspace
    useEffect(() => {
        async function loadLast() {
            try {
                const lastPath = await invoke<string | null>("get_last_workspace");
                if (lastPath) {
                    // Já temos o path, carrega o workspace.json dele
                    const config = await invoke<WorkspaceConfig>("load_workspace", {
                        path: lastPath
                    });
                    setWorkspace(config);
                }
            } catch (error) {
                console.error("Erro ao carregar último workspace:", error);
            } finally {
                setLoading(false);
            }
        }

        loadLast();
    }, []);

    async function selectWorkspace() {
        try {
            setLoading(true);
            const config = await invoke<WorkspaceConfig | null>("select_workspace");
            setWorkspace(config);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return { workspace, loading, selectWorkspace };
}