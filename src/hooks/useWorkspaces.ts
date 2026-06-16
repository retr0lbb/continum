import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { WorkspaceConfig } from "../types/workspace.type";
import { Project, ProjectInfo } from "../types/project.type";
import { useSessions } from "./useSessions";
import { useSessionStore } from "../stores/session.store";


export function useWorkspace() {
    const [workspace, setWorkspace] = useState<WorkspaceConfig | null>(null);
    const [repos, setRepos] = useState<ProjectInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const { openWorkspaceSession, closeWorkspaceSession, openProjectSession} = useSessions();
    const activeWorkspacePath = useSessionStore((s) => s.activeWorkspacePath);
    const setActiveWorkspacePath = useSessionStore((s) => s.setActiveWorkspacePath);
    const setWorkspaceSessionStart = useSessionStore((s) => s.setWorkspaceSessionStart);
    const setActiveProjectPath = useSessionStore((s) => s.setActiveProjectPath);
    const setProjectSessionStart = useSessionStore((s) => s.setProjectSessionStart);

    async function handleWorkspaceOpened(config: WorkspaceConfig) {
        if (activeWorkspacePath && activeWorkspacePath !== config.path) {
            await closeWorkspaceSession(activeWorkspacePath);
        }
        await openWorkspaceSession(config.path);
        setActiveWorkspacePath(config.path);
        setWorkspaceSessionStart(new Date().toISOString());
    }

    async function loadWorkspace(path: string) {
        const config = await invoke<WorkspaceConfig>("load_workspace", { path });
        const repositories = await invoke<ProjectInfo[]>("get_repositories", { wsPath: path });
        setWorkspace(config);
        setRepos(repositories);
        await handleWorkspaceOpened(config);
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
            await handleWorkspaceOpened(config);
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

        await openProjectSession(data.path);
        setActiveProjectPath(data.path);
        setProjectSessionStart(new Date().toISOString());

        return data
    }

    async function openProject(path: string): Promise<Project> {
        const data = await invoke<Project>("open_project", { path });

        await openProjectSession(data.path);
        setActiveProjectPath(data.path);
        setProjectSessionStart(new Date().toISOString());

        return data;
    }

    async function createProjectFolder(wsPath: string, folderName: string){
        try {
            const newRepo = await invoke<Project>("create_project_folder", {path: wsPath, name: folderName})
            setRepos((prev) => 
                [...prev, 
                    {
                        name: newRepo.name, 
                        last_opened: newRepo.last_opened, 
                        initialized: true,
                        path: newRepo.path
                    }
                ])
        } catch (error) {
            setRepos(repos)
        }
    }



    return { workspace, repos, loading, selectWorkspace, initProject, openProject, createProjectFolder };
}