import { tv } from "tailwind-variants";
import { TaskStatus } from "../types/tasks.type";

// task-card.tsx
interface TaskCardProps {
    text: string;
    status: TaskStatus | "create";
    selected?: boolean;
    picked?: boolean;
    className?: string;
    onActivate?: () => void;
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
        },
        picked: {
            true: "opacity-50 scale-95 transition-all" // <- feedback visual de "segurando"
        }
    },
    compoundVariants: [
        {
            selected: true,
            status: "done",
            className: "bg-background-main text-accent border-accent transition-all"
        }
    ]
})

export function TaskCard(props: TaskCardProps) {
    return (
        <p
            className={taskCardVariants({
                className: props.className,
                status: props.status,
                selected: props.selected,
                picked: props.picked
            })}
            data-selected={props.selected ? "true" : undefined}
            onClick={props.onActivate}
        >
            {props.text}
        </p>
    )
}