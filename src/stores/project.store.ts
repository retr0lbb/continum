import { create } from "zustand";
import { Project } from "../types/project.type";

interface ProjectStore {
  project: Project | null;
  setProject: (proj: Project | null) => void;
}

export const useProject = create<ProjectStore>((set) => ({
  project: null,
  setProject: (proj) => set({project: proj}),
}));