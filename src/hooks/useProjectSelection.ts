import { useGridNavigation } from "./useGridNavigation";
import { ProjectInfo } from "../types/project.type";

interface useProjectSelectionProps{
  repos: ProjectInfo[],
  onActivate: (repo: ProjectInfo, index: number) => void,
  onDeleteProject: (repo: ProjectInfo) => void,
  onUpdateProject: (repo: ProjectInfo) => void,
  onCreateProject: () => void
}

export function useProjectSelection({onActivate, onCreateProject, onDeleteProject,  onUpdateProject, repos}: useProjectSelectionProps) {
  const navigation = useGridNavigation({
    colCount: 1,
    rowCount: repos.length,
    onActivate: (_col, row) => onActivate(repos[row], row),
    keyBindings: {
      "shift+e": (_col, row) => onDeleteProject(repos[row]),
      "shift+q": (_col, row) => onUpdateProject(repos[row]),
      "shift+n": () =>  onCreateProject()
    }
  });

  return {
    ...navigation,
    selectedRepoIndex: navigation.selectedRow,
  };
}
