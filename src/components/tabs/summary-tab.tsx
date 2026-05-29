import { DiffCard } from "../diff-card";


export function SummaryTab(){
    return(
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
    )
}