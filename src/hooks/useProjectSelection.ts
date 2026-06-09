import { useGridNavigation } from "./useGridNavigation";
import { ProjectInfo } from "../types/project.type";

export function useProjectSelection(
  repos: ProjectInfo[],
  onActivate: (repo: ProjectInfo, index: number) => void
) {
  const navigation = useGridNavigation({
    colCount: 1,
    rowCount: repos.length,
    onActivate: (_col, row) => onActivate(repos[row], row),
  });

  return {
    ...navigation,
    selectedRepoIndex: navigation.selectedRow,
  };
}
