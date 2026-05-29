import { ArrowLeft, Plus } from "lucide-react";
import { WeeklySquares } from "../../components/weekly-squares";
import { Tab, TabSwitcher } from "../../components/tabSwitcher";
import { DiffCard } from "../../components/diff-card";


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

        <div className="flex flex-1">
            <div className="flex gap-2">
                <div className="flex flex-col items-center gap-2.5 w-1/2 pb-2 overflow-hidden">
                    <p className="w-full text-muted-text text-lg font-medium text-center">Done</p>

                    <DiffCard text="Fazer a api do mimer e ver se o card suporta ate 2 linhas" variant="green" />
                    <DiffCard text="Implementar JWT" variant="green" />
                    <DiffCard text="Verificar Logs" variant="green" />

                </div>

                <div className="flex flex-col items-center gap-2.5 w-1/2 pb-2 overflow-hidden">
                    <p className="w-full text-muted-text text-lg font-medium text-center">Pending</p>

                    <DiffCard text="Fazer a api do mimer e ver se o card suporta ate 2 linhas" variant="red" />
                    <DiffCard text="Implementar JWT" variant="red" />
                    <DiffCard text="Verificar Logs" variant="red" />

                </div>
            </div>

            <div className="w-2/3 p-1 flex flex-col items-center gap-2">
                <h1 className="w-full text-center text-xl text-main-text font-medium">Sessao</h1>

                <div className="w-full">
                    <p className="text-lg text-main-text w-full text-center">data: <span className="text-accent font-bold">31/08/2026</span></p>
                    <p className="text-lg text-main-text w-full text-center">Tasks Completas: <span className="text-accent font-bold">14</span></p>
                    <p className="text-lg text-main-text w-full text-center">Ultima vez aberto: <br></br><span className="text-accent font-bold">1 dia atras</span></p>
                </div>
            </div>
        </div>

    </main>
}