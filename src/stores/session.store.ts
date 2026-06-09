import { create } from "zustand";

interface SessionStore {
  activeWorkspacePath: string | null;
  activeProjectPath: string | null;
  workspaceSessionStart: string | null;
  projectSessionStart: string | null;
  setActiveWorkspacePath: (path: string | null) => void;
  setActiveProjectPath: (path: string | null) => void;
  setWorkspaceSessionStart: (start: string | null) => void;
  setProjectSessionStart: (start: string | null) => void;
  clearWorkspaceSession: () => void;
  clearProjectSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  activeWorkspacePath: null,
  activeProjectPath: null,
  workspaceSessionStart: null,
  projectSessionStart: null,
  setActiveWorkspacePath: (path) => set({ activeWorkspacePath: path }),
  setActiveProjectPath: (path) => set({ activeProjectPath: path }),
  setWorkspaceSessionStart: (start) => set({ workspaceSessionStart: start }),
  setProjectSessionStart: (start) => set({ projectSessionStart: start }),
  clearWorkspaceSession: () =>
    set({ activeWorkspacePath: null, workspaceSessionStart: null }),
  clearProjectSession: () =>
    set({ activeProjectPath: null, projectSessionStart: null }),
}));
