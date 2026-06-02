import { tv } from "tailwind-variants"
import { useTaskSelection } from "../../hooks/useTaskSelection"

const columns = [
    {
        status: "todo" as const,
        label: "Todo",
        tasks: Array.from({length: 5}).map((_, index) => `${index+1}# Task`)
    },
    {
        status: "doing" as const,
        label: "Doing",
        tasks: Array.from({length: 5}).map((_, index) => `${index+1}# Task`)
    },
    {
        status: "done" as const,
        label: "Done",
        tasks: Array.from({length: 5}).map((_, index) => `${index+1}# Task`)
    },
]

interface TasksTabProps{
    isVisible?: boolean
}

export function TasksTab(props: TasksTabProps){
    const { handleKeyDown, isSelected, containerRef } = useTaskSelection(columns)

    return (
        <div
            ref={containerRef}
            className={`w-full h-full flex flex-col outline-none overflow-hidden ${!props.isVisible && "hidden"}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="w-full flex items-center justify-around pb-2" >
                {columns.map(col => (
                    <p key={col.status} className="text-muted-text">{col.label}</p>
                ))}
            </div>

            <div className="flex flex-1 gap-2 min-h-0">
                {columns.map((col, colIndex) => (
                    <div
                        key={col.status}
                        className="flex flex-col w-full min-h-0 overflow-y-auto scrollbar-none gap-2"
                    >
                        {col.tasks.map((task, rowIndex) => (
                            <TaskCard
                                key={`${col.status}-${rowIndex}`}
                                status={col.status}
                                text={task}
                                selected={isSelected(colIndex, rowIndex)}
                            />
                        ))}
                    </div>
                ))}
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
    base: `p-2.5 flex items-center justify-center overflow-hidden 
    w-full rounded-sm text-center cursor-pointer font-medium select-none shrink-0`,
    variants: {
        status: {
            todo: "border border-muted-text text-muted-text",
            doing: "border border-main-text text-main-text",
            done: "text-background-main select-none border bg-accent border-accent"
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
        }
    ]
})

export function TaskCard(props: TaskCardProps){
    return(
        <p
            className={taskCardVariants({className: props.className, status: props.status, selected: props.selected})}
            data-selected={props.selected ? "true" : undefined}
        >
            {props.text}
        </p>
    )
}
