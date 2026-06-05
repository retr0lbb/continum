// useWorkspace.ts
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

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

export function useWorkspace() {
    const [workspace, setWorkspace] = useState<WorkspaceConfig | null>(null);
    const [repos, setRepos] = useState<ProjectInfo[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadWorkspace(path: string) {
        const config = await invoke<WorkspaceConfig>("load_workspace", { path });
        const repositories = await invoke<ProjectInfo[]>("get_repositories", { wsPath: path });
        setWorkspace(config);
        setRepos(repositories);
    }

    // Tenta carregar o último workspace ao iniciar
    useEffect(() => {
        async function init() {
            try {
                const lastPath = await invoke<string | null>("get_last_workspace");
                if (lastPath) await loadWorkspace(lastPath);
            } catch (error) {
                console.error("Erro ao iniciar:", JSON.stringify(error));
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    async function selectWorkspace() {
        try {
            setLoading(true);
            const config = await invoke<WorkspaceConfig | null>("select_workspace");
            if (!config) return;
            const repositories = await invoke<ProjectInfo[]>("get_repositories", { wsPath: config.path });
            setWorkspace(config);
            setRepos(repositories);
        } catch (error) {
            console.error("Erro:", JSON.stringify(error));
        } finally {
            setLoading(false);
        }
    }

    async function initProject(path: string) {
        await invoke("init_project", { path });
        // Reescaneia os repos após inicializar
        if (workspace) {
            const repositories = await invoke<ProjectInfo[]>("get_repositories", { wsPath: workspace.path });
            setRepos(repositories);
        }
    }

    async function openProject(path: string) {
        return await invoke("open_project", { path });
    }

    return { workspace, repos, loading, selectWorkspace, initProject, openProject };
}