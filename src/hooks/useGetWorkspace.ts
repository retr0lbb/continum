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
                console.log("lastPath:", lastPath);
            
                if (lastPath) {
                    const config = await invoke<WorkspaceConfig>("load_workspace", { path: lastPath });
                    console.log("config:", config);
                    setWorkspace(config);
                }
            } catch (error) {
                // Mostra o erro completo, não só a mensagem
                console.error("Erro detalhado:", JSON.stringify(error));
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