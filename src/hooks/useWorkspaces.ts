// useWorkspace.ts
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { WorkspaceConfig } from "./useGetWorkspace";
import { Project, ProjectInfo } from "../types/project.type";


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

    async function initProject(path: string): Promise<Project> {
        const data = await invoke<Project>("init_project", { path });
        if (workspace) {
            const repositories = await invoke<ProjectInfo[]>("get_repositories", { wsPath: workspace.path });
            setRepos(repositories);
        }

        console.log("DATA DO HOOK", data)

        return data
    }

    async function openProject(path: string): Promise<Project> {
        return await invoke<Project>("open_project", { path });
    }

    return { workspace, repos, loading, selectWorkspace, initProject, openProject };
}