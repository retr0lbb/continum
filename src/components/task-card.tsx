import { tv } from "tailwind-variants"
import { TaskStatus } from "../types/tasks.type"

interface TaskCardProps {
    text: string,
    status: TaskStatus | "create",
    selected?: boolean,
    className?: string
}
const taskCardVariants = tv({
    base: `p-2.5 flex items-center justify-center overflow-hidden 
    w-full rounded-sm text-center cursor-pointer font-medium select-none shrink-0`,
    variants: {
        status: {
            todo: "border border-muted-text text-muted-text",
            doing: "border border-main-text text-main-text",
            done: "text-background-main select-none border bg-accent border-accent",
            create: "border border-dashed border-zinc-800 hover:border-zinc-500 text-muted-text"
        },
        selected: {
            true: "text-accent border-accent transition-all"
        }
    },
    compoundVariants: [
        {
            selected: true,
            status: "done",
            className: "bg-background-main text-accent border-accent transition-all"
        },
        {selected: true, status: "create", className: "border-green-500 border-dashed"}
    ]
})


export function TaskCard(props: TaskCardProps) {
    return (
        <p
            className={taskCardVariants({ className: props.className, status: props.status, selected: props.selected })}
            data-selected={props.selected ? "true" : undefined}
        >
            {props.text}
        </p>
    )
}
