import { useState, useCallback } from "react";
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

    const { isLoading, columns, columnsWithCreate, createTask, moveTask, deleteTask, updateTask } = useProjectTasks({ projectPath: project.path })

    const [editingTask, setEditingTask] = useState<{ col: number; row: number } | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleTaskEdit = useCallback((col: number, row: number) => {
        const task = columnsWithCreate[col]?.tasks[row] as any;
        if (!task || task.status === "create") return;
        setEditingTask({ col, row });
        setEditValue(task.title);
    }, [columnsWithCreate]);

    const { handleKeyDown, isSelected, containerRef, isHovering, isPickedTask, selectedCol, pickedCol } = useTaskSelection(
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
                    createTask("Nova Task")
                }
            },
            onTaskDelete: (col, row) => {
                const task = columnsWithCreate[col].tasks[row]

                if(!task || task.status == "create") return

                deleteTask(task)
            },
            onTaskEdit: handleTaskEdit,
        }
    )

    const handleEditConfirm = useCallback(() => {
        if (!editingTask) return;
        const task = columnsWithCreate[editingTask.col]?.tasks[editingTask.row] as Task;
        if (task) {
            updateTask(task, editValue);
        }
        setEditingTask(null);
        setEditValue("");
        setTimeout(() => containerRef.current?.focus(), 0);
    }, [editingTask, columnsWithCreate, editValue, updateTask, containerRef]);

    const handleEditCancel = useCallback(() => {
        setEditingTask(null);
        setEditValue("");
        setTimeout(() => containerRef.current?.focus(), 0);
    }, [containerRef]);

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
                        className={`flex flex-col w-full min-h-0 overflow-y-auto scrollbar-none gap-2 rounded-sm transition-colors ${
                            isHovering && selectedCol === colIndex && pickedCol !== colIndex ? "border-2 border-accent" : ""
                        }`}
                    >
                        {col.tasks.map((task, rowIndex) => {
                            const isEditing = editingTask?.col === colIndex && editingTask?.row === rowIndex;
                            return (
                                <TaskCard
                                    key={`${col.status}-${rowIndex}`}
                                    status={task.status as TaskStatus | "create"}
                                    text={task.title}
                                    selected={!isHovering && isSelected(colIndex, rowIndex)}
                                    picked={isPickedTask(colIndex, rowIndex)}
                                    onActivate={task.status === "create" ? () => createTask("Nova Task") : undefined}
                                    isEditing={isEditing}
                                    editValue={editValue}
                                    onEditChange={setEditValue}
                                    onEditConfirm={handleEditConfirm}
                                    onEditCancel={handleEditCancel}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}