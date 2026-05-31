import { tv } from "tailwind-variants"

export function TasksTab(){
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full flex items-center justify-around" >
                <p className="text-muted-text">Todo</p>
                <p className="text-muted-text">Doing</p>
                <p className="text-muted-text">Done</p>
            </div>

            <div className="flex flex-1 gap-2">
                <div className="flex flex-col w-full overflow-y-auto gap-2">
                    <TaskCard status="todo" text="Fazer Api do mimer teste com mais de una linha" />
                </div>
                <div className="flex flex-col w-full overflow-y-auto gap-2">
                    <TaskCard status="doing" text="Fazer Api do mimer" />
                    <TaskCard status="doing" text="Fazer Api do mimer" />
                    <TaskCard status="doing" text="Fazer Api do mimer" />

                </div>
                <div className="flex flex-col w-full overflow-y-auto gap-2">
                    <TaskCard status="done" text="Fazer Api do mimer" />
                    <TaskCard status="done" text="Fazer Api do mimer" />
                </div>
            </div>
        </div>
        
    )
}


interface TaskCardProps{
    text: string,
    status: "todo" | "doing" | "done",
    selected?: boolean,
    className?: string
}
const taskCardVariants = tv({
    base: "p-2.5 flex items-center justify-center overflow-hidden w-full rounded-sm text-center cursor-pointer font-medium select-none",
    variants: {
        status: {
            todo: "border border-muted-text text-muted-text hover:text-accent hover:border-accent transition-all",
            doing: "border border-main-text text-main-text hover:text-accent hover:border-accent transition-all",
            done: "text-background-main select-none border bg-accent border-accent hover:text-accent hover:border-accent hover:bg-background-main transition-all"
        }
    }
})

export function TaskCard(props: TaskCardProps){
    return(
        <p className={taskCardVariants({className: props.className, status: props.status})}>
            {props.text}
        </p>
    )
}