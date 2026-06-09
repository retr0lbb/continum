import { ArrowLeft } from "lucide-react";
import { WeeklySquares } from "../../components/weekly-squares";
import { Tab, TabSwitcher } from "../../components/tabSwitcher";
import { SummaryTab } from "../../components/tabs/summary-tab";
import { TasksTab } from "../../components/tabs/tasks-tab";
import { NotesTab } from "../../components/tabs/notes-tab";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useProject } from "../../stores/project.store";
import { ActiveCounter } from "../../components/active-conter";


export function MainPage() {

    const [tab, setTab] = useState<"task" | "summary" | "notes">("summary")
    const {project, setProject} = useProject()
    const navigator = useNavigate();

    if(!project){
        console.log("Projeto nao carregado voltando a estaca 00")
        returnToMain()
        return
    }

    function returnToMain() {
        setProject(null)
        navigator("/");
    }

    if(!project){
        return <p> No project here </p>
    }


    return <main className="w-screen h-screen bg-background-main flex flex-col p-3 gap-2">
        <div className="flex items-center justify-between">
            <div data-tauri-drag-region onClick={() => returnToMain()} className="flex items-center justify-center gap-1">
                <ArrowLeft className="size-5 text-main-text" />
                <h1 className="text-lg text-main-text">Dinheirama</h1>
            </div>

            <div className="flex flex-col items-end gap-1">
                <ActiveCounter last_time={project.last_opened} />
                <WeeklySquares />
            </div>
        </div>

        <div className="w-full h-px bg-main-text/10" />

        <TabSwitcher>
            <Tab onClick={() => setTab("summary")} name="Summary" isSelected={tab === "summary"} />
            <Tab onClick={() => setTab("task")} name="Tasks" isSelected={tab === "task"} />
            <Tab onClick={() => setTab("notes")} name="Notes" isSelected={tab === "notes"} />
        </TabSwitcher>

        <div className="w-full h-px bg-main-text/10" />

        <SummaryTab isVisible={tab === "summary"} />
        <TasksTab isVisible={tab === "task"} />
        <NotesTab isVisible={tab === "notes"} />
    </main>
}