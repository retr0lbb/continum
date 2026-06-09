import { invoke } from "@tauri-apps/api/core";
import { useState, useCallback, useEffect } from "react";
import { Task } from "../types/tasks.type";

interface UseProjectTasksParams {
  projectPath: string;
}

export function useProjectTasks({ projectPath }: UseProjectTasksParams) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectTasks = useCallback(async () => {
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

  useEffect(() => {
    getProjectTasks();
  }, [getProjectTasks]);

  return { tasks, isLoading, error, getProjectTasks };
}
