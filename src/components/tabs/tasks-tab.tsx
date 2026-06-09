import { tv } from "tailwind-variants"
import { useTaskSelection } from "../../hooks/useTaskSelection"
import { useProjectTasks } from "../../hooks/useProjectTasks"
import { useProject } from "../../stores/project.store"
import { TaskStatus } from "../../types/tasks.type"
import { TaskCard } from "../task-card"

interface TasksTabProps {
    isVisible?: boolean
}

export function TasksTab(props: TasksTabProps) {
    const {project} = useProject()
    
    if(!project){
        return
    }
    
    const { isLoading, columns, columnsWithCreate, createTask } = useProjectTasks({projectPath: project.path})
    const { handleKeyDown, isSelected, containerRef } = useTaskSelection(columnsWithCreate)

    if(isLoading){
        return <p className="text-zinc-200">Loading...</p>
    }


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
                {columnsWithCreate.map((col, colIndex) => (
                    <div
                        key={col.status}
                        className="flex flex-col w-full min-h-0 overflow-y-auto scrollbar-none gap-2"
                    >
                        {col.tasks.map((task, rowIndex) => {

                            return(
                                <TaskCard
                                    key={`${col.status}-${rowIndex}`}
                                    status={task.status as TaskStatus | "create"}
                                    text={task.title}
                                    selected={isSelected(colIndex, rowIndex)}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
