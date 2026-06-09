import { WorkspaceButton } from "../../components/workspace-button";
import { useNavigate } from "react-router";
import { useWorkspace } from "../../hooks/useWorkspaces";
import { ProjectLabel } from "../../components/project-label";
import { useProject } from "../../stores/project.store";
import { Project } from "../../types/project.type";

export function InitialPage() {
    const navigate = useNavigate();
    const {workspace, selectWorkspace, initProject, loading, openProject, repos} = useWorkspace()
    const {project, setProject} = useProject()


    if(project !== null){
        navigate("/project")
        return
    }

    async function handleOpenProject(path: string) {
    try {
        let data: Project;

        try {
            data = await openProject(path);
        } catch {
            // Se falhou, tenta inicializar
            data = await initProject(path);
        }

        setProject(data);
        navigate("/project");
        } catch (error) {
            console.error("Erro ao abrir projeto:", error);
        }
    }


    return <main className="w-screen h-screen bg-background-main flex flex-col p-3 gap-2">
        {
            loading 
            ? (
                <p>Loading...</p>
            )
            :(
                <>
                    <div data-tauri-drag-region className="w-full flex items-center justify-between">
                        <h1 className="font-normal text-main-text">Projetos</h1>
                        <div className="flex items-center">
                            <WorkspaceButton onClick={selectWorkspace}>
                                <p className="text-main-text hover:bg-white/10 transition-all font-normal py-1 px-2 rounded-lg border border-muted-text/50">
                                    {workspace?.path && workspace.path}
                                </p>
                            </WorkspaceButton>
                        </div>
                    </div>

                    <div className="w-full h-0.5 rounded-full bg-main-text/10" />

                    <div className="flex flex-1 flex-wrap gap-6 items-start">
                        {repos.map(repo => {
                            return(
                                <ProjectLabel 
                                  name={repo.name} 
                                  lastUpdate={repo.last_opened ?? ""} 
                                  onClick={() => handleOpenProject(repo.path)} 
                                  isSelected      
                                />
                                
                            )
                        })}
                    </div>
                </>
            ) 
        }
    </main>
}