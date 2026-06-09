import { invoke } from "@tauri-apps/api/core";
import { useCallback } from "react";

export function useSessions() {
  const openWorkspaceSession = useCallback(
    (wsPath: string): Promise<void> => invoke("open_ws_session", { wsPath }),
    []
  );

  const closeWorkspaceSession = useCallback(
    (wsPath: string): Promise<void> => invoke("close_ws_session", { wsPath }),
    []
  );

  const openProjectSession = useCallback(
    (projectPath: string): Promise<void> =>
      invoke("open_project_session", { projectPath }),
    []
  );

  const closeProjectSession = useCallback(
    (projectPath: string): Promise<void> =>
      invoke("close_project_session", { projectPath }),
    []
  );

  return {
    openWorkspaceSession,
    closeWorkspaceSession,
    openProjectSession,
    closeProjectSession,
  };
}
