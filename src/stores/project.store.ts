import { create } from "zustand";
import { Project } from "../hooks/useWorkspaces";

interface ProjectStore {
  project: Project | null;
  setProject: (proj: Project | null) => void;
}

export const useProject = create<ProjectStore>((set) => ({
  project: null,
  setProject: (proj) => set({project: proj}),
}));