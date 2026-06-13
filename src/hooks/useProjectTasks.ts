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
            const data = await invoke<Task[]>("read_project_tasks", { projectPath: projectPath });
            setTasks(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setIsLoading(false);
        }
    }, [projectPath]);

    //cria a função passando um callback para evitar re-rendering
    const moveTask = useCallback(async (task: Task, targetStatus: TaskStatus) => {
        // ve se a task ja esta com o estatus que desejamos, se sim ele cancela a operacao
      if (task.status === targetStatus) return;

      //acha o index da task
      const sourceIndex = tasks.findIndex(t => t.title === task.title && t.status === task.status);

      //se o índice nao existe ele volta -1 entao se a task nao existir ele cancela
      if (sourceIndex === -1) return;
      
      //retira a task da lista de tasks
      const withoutTask = tasks.filter((_, i) => i !== sourceIndex);

      // muda o status da task para o estatus desejado
      const updatedTask: Task = { title: task.title, status: targetStatus };

      // Acha o índice do primeiro item da coluna alvo e insere antes dele (topo)
      const firstOfTarget = withoutTask.findIndex(t => t.status === targetStatus);

      //atualiza a tasks pelo seguinte se nao existe uma task naquela coluna ainda ele coloca a task la
      // porem se existir uma task ja ele pega todas as tasks antes da task da nova coluna, 
      // coloca nossa task depois o resto dela
      const updated = firstOfTarget === -1
          ? [...withoutTask, updatedTask]
          : [...withoutTask.slice(0, firstOfTarget), updatedTask, ...withoutTask.slice(firstOfTarget)];

    //atualiza o estado
      setTasks(updated);
      try {
        //tenta salvar a task se nao der certo ele volta para o estado anterior
          await invoke("save_project_tasks", { projectPath, tasks: updated });
      } catch (err) {
          setTasks(tasks);
          setError(String(err));
      }
    }, [projectPath, tasks]);

    const createTask = useCallback(async (title: string) => {
        const newTask: Task = { title, status: TaskStatus.todo };
        const updated = [...tasks, newTask];
        setTasks(updated);
        try {
            await invoke("save_project_tasks", { projectPath, tasks: updated });
        } catch (err) {
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

    const deleteTask = useCallback(async (task: Task) => {
        const updated = tasks.filter(t => !(t.title === task.title && t.status === task.status));
        setTasks(updated);
        try {
            await invoke("save_project_tasks", { projectPath, tasks: updated });
        } catch (err) {
            setTasks(tasks);
            setError(String(err));
        }
    }, [projectPath, tasks]);

    const updateTask = useCallback(async (oldTask: Task, newTitle: string) => {
        if (oldTask.title === newTitle) return;

        const updated = tasks.map(t =>
            t.title === oldTask.title && t.status === oldTask.status
                ? { ...t, title: newTitle }
                : t
        );

        setTasks(updated);
        try {
            await invoke("save_project_tasks", { projectPath, tasks: updated });
        } catch (err) {
            setTasks(tasks);
            setError(String(err));
        }
    }, [projectPath, tasks]);

    return { tasks, columns, columnsWithCreate, isLoading, error, fetchTasks, createTask, moveTask, deleteTask, updateTask };
}