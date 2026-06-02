import { ArrowLeft } from "lucide-react";
import { WeeklySquares } from "../../components/weekly-squares";
import { Tab, TabSwitcher } from "../../components/tabSwitcher";
import { SummaryTab } from "../../components/tabs/summary-tab";
import { TasksTab } from "../../components/tabs/tasks-tab";
import { NotesTab } from "../../components/tabs/notes-tab";
import { useState } from "react";


export function MainPage(){

    const [tab, setTab] = useState<"task" | "summary" | "notes">("summary")

    return <main className="w-180 h-100 bg-background-main flex flex-col p-3 gap-2">
        <div className="flex items-center justify-between">
            <div data-tauri-drag-region className="flex items-center justify-center gap-1">
                <ArrowLeft className="size-5 text-main-text"/>
                <h1 className="text-lg text-main-text">Dinheirama</h1>
            </div>

            <div className="flex flex-col items-end gap-1">
                <p className="text-main-text">Ativo Por: <span className="text-accent text-md">01:46:15</span></p>
                <WeeklySquares />
            </div>
        </div>

        <div className="w-full h-px bg-main-text/10"/>

        <TabSwitcher>
            <Tab onClick={() => setTab("summary")} name="Summary" isSelected={tab === "summary"} />
            <Tab onClick={() => setTab("task")} name="Tasks" isSelected={tab === "task"}/>
            <Tab onClick={() => setTab("notes")} name="Notes" isSelected={tab === "notes"}/>
        </TabSwitcher>

        <div className="w-full h-px bg-main-text/10"/>

        <SummaryTab  isVisible={tab === "summary" }/>
        <TasksTab isVisible={tab === "task"} /> 
        <NotesTab isVisible={tab === "notes"} />
    </main>
}