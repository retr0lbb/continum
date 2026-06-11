import { tv } from "tailwind-variants"
import { useTaskSelection } from "../../hooks/useTaskSelection"
import { useProjectTasks } from "../../hooks/useProjectTasks"
import { useProject } from "../../stores/project.store"
import { Task, TaskStatus } from "../../types/tasks.type"
import { TaskCard } from "../task-card"

interface TasksTabProps {
    isVisible?: boolean
}
export function TasksTab(props: TasksTabProps) {
    const { project } = useProject()

    if (!project) return

    const { isLoading, columns, columnsWithCreate, createTask, moveTask } = useProjectTasks({ projectPath: project.path })

    const { handleKeyDown, isSelected, containerRef, isHovering, isPickedTask } = useTaskSelection(
        columnsWithCreate,
        {
            onMoveTask: (sourceCol, sourceRow, targetCol) => {
                const task = columnsWithCreate[sourceCol].tasks[sourceRow] as Task;
                const targetStatus = columnsWithCreate[targetCol].status as TaskStatus;
                moveTask(task, targetStatus);
            },
            canPickUp: (col, row) => {
                const task = columnsWithCreate[col].tasks[row] as any;
                return task?.status !== "create";
            },
            onActivate: (col, row) => {
                const task = columnsWithCreate[col]?.tasks[row];
                if(task.status === "create"){
                    console.log("Hey this task is being created")
                }
            },
        }
    )

    if (isLoading) return <p className="text-zinc-200">Loading...</p>

    return (
        <div
            ref={containerRef}
            className={`w-full h-full flex flex-col outline-none overflow-hidden ${!props.isVisible && "hidden"}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="w-full flex items-center justify-around pb-2">
                {columns.map(col => (
                    <p key={col.status} className="text-muted-text">{col.label}</p>
                ))}
            </div>

            <div className="flex flex-1 gap-2 min-h-0">
                {columnsWithCreate.map((col, colIndex) => (
                    <div
                        key={col.status}
                        // Highlight na coluna alvo quando tem task picked
                        className={`flex flex-col w-full min-h-0 overflow-y-auto scrollbar-none gap-2 rounded-sm transition-colors ${
                            isHovering && !isPickedTask(colIndex, 0) ? "bg-main-text/5" : ""
                        }`}
                    >
                        {col.tasks.map((task, rowIndex) => (
                            <TaskCard
                                key={`${col.status}-${rowIndex}`}
                                status={task.status as TaskStatus | "create"}
                                text={task.title}
                                selected={isSelected(colIndex, rowIndex)}
                                picked={isPickedTask(colIndex, rowIndex)}
                                onActivate={task.status === "create" ? () => createTask("Nova Task") : undefined}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}