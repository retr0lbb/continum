import { ArrowLeft } from "lucide-react";
import { WeeklySquares } from "../../components/weekly-squares";
import { Tab, TabSwitcher } from "../../components/tabSwitcher";
import { SummaryTab } from "../../components/tabs/summary-tab";
import { TasksTab } from "../../components/tabs/tasks-tab";


export function MainPage(){
    return <main className="w-180 h-100 bg-background-main flex flex-col p-3 gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-1">
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
            <Tab name="Summary" isSelected />
            <Tab name="Tasks" />
            <Tab name="Notes" />
        </TabSwitcher>

        <div className="w-full h-px bg-main-text/10"/>

        {/* <SummaryTab /> */}
        <TasksTab />

    </main>
}