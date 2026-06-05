import { WorkspaceButton } from "../../components/workspace-button";
import { useNavigate } from "react-router";
import { useWorkspace } from "../../hooks/useGetWorkspace";

export function InitialPage() {
    const navigate = useNavigate();
    const { loading, selectWorkspace, workspace } = useWorkspace()

    function navigateToScreen() {
        navigate("/project");
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
                        {/* Some let mut */}
                    </div>
                </>
            ) 
        }
    </main>
}