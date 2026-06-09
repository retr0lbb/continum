import { invoke } from "@tauri-apps/api/core";
import { useState, useCallback, useEffect } from "react";
import { Task, TaskStatus } from "../types/tasks.type";

interface UseProjectTasksParams {
    projectPath: string;
}

interface FormattedColumn {
    status: TaskStatus | "create";
    label: string;
    tasks: Task[];
}

export function useProjectTasks({ projectPath }: UseProjectTasksParams) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await invoke<Task[]>("read_project_tasks", { projectPath });
            setTasks(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setIsLoading(false);
        }
    }, [projectPath]);

    const createTask = useCallback(async (title: string) => {
        const newTask: Task = { title, status: TaskStatus.todo };
        const updated = [...tasks, newTask];
        setTasks(updated);
        try {
            await invoke("save_tasks", { projectPath, tasks: updated });
        } catch (err) {
            // Reverte se falhar
            setTasks(tasks);
            setError(String(err));
        }
    }, [projectPath, tasks]);

    const columns: FormattedColumn[] = [
        {
            status: TaskStatus.todo,
            label: "Todo",
            tasks: [...tasks.filter(t => t.status === TaskStatus.todo)],
        },
        {
            status: TaskStatus.doing,
            label: "Doing",
            tasks: tasks.filter(t => t.status === TaskStatus.doing),
        },
        {
            status: TaskStatus.done,
            label: "Done",
            tasks: tasks.filter(t => t.status === TaskStatus.done),
        },
    ];

    // Adiciona o card de criar na coluna Todo
    const columnsWithCreate = columns.map((col, index) => ({
        ...col,
        tasks: index === 0
            ? [...col.tasks, { title: "Nova Task", status: "create" as const }]
            : col.tasks
    }));

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, columns, columnsWithCreate, isLoading, error, fetchTasks, createTask };
}