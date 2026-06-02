import { ProjectLabel } from "../../components/project-label";
import { WorkspaceButton } from "../../components/workspace-button";
import { useNavigate } from "react-router";

export function InitialPage() {
    const navigate = useNavigate();

    function navigateToScreen() {
        navigate("/project");
    }
    return <main className="w-screen h-screen bg-background-main flex flex-col p-3 gap-2">
        <div data-tauri-drag-region className="w-full flex items-center justify-between">
            <h1 className="font-normal text-main-text">Projetos</h1>
            <p className="font-normal text-main-text">Workspace - None</p>
        </div>

        <div className="w-full h-0.5 rounded-full bg-main-text/10" />

        <div className="flex flex-1 flex-wrap gap-6 items-start">
            {/* <ProjectLabel onClick={() => navigateToScreen()} isSelected name="Dinheirama" lastUpdate="3" />
            <ProjectLabel onClick={() => navigateToScreen()} name="Mimer" lastUpdate="10" />
            <ProjectLabel onClick={() => navigateToScreen()} name="Pierre" lastUpdate="3" />
            <ProjectLabel onClick={() => navigateToScreen()} name="EventFlow" lastUpdate="3" />
            <ProjectLabel onClick={() => navigateToScreen()} name="Tamo-junto" lastUpdate="3" />
            <ProjectLabel onClick={() => navigateToScreen()} name="Continum" lastUpdate="3" /> */}

            <WorkspaceButton />
        </div>
    </main>
}