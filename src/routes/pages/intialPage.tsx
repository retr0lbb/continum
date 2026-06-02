import { ProjectLabel } from "../../components/project-label";

export function InitialPage(){
    return <main className="w-180 h-100 bg-background-main flex flex-col p-3 gap-2">
        <div data-tauri-drag-region className="w-full flex items-center justify-between">
            <h1 className="font-normal text-main-text">Projetos</h1>
            <p className="font-normal text-main-text">Workspace - Desktop/documents</p>
        </div>

        <div className="w-full h-0.5 rounded-full bg-main-text/10" />

        <div className="flex flex-1 flex-wrap gap-6 items-start">
            <ProjectLabel isSelected name="Dinheirama" lastUpdate="3" />
            <ProjectLabel name="Mimer" lastUpdate="10" />
            <ProjectLabel name="Pierre" lastUpdate="3" />
            <ProjectLabel name="EventFlow" lastUpdate="3" />
            <ProjectLabel name="Tamo-junto" lastUpdate="3" />
            <ProjectLabel name="Continum" lastUpdate="3" />
        </div>
    </main>
}