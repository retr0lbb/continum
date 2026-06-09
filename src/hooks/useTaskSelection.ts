import { useGridNavigation } from "./useGridNavigation";

interface UseTaskSelectionColumn {
  tasks: unknown[];
}

export function useTaskSelection(columns: UseTaskSelectionColumn[]) {
  return useGridNavigation({
    colCount: columns.length,
    rowCount: (col) => columns[col].tasks.length,
  });
}
