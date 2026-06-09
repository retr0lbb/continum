import { useState, useCallback, useRef } from "react";
import { useGridNavigation } from "./useGridNavigation";

interface UseTaskSelectionColumn {
  tasks: unknown[];
}

interface UseTaskSelectionOptions {
  onMoveTask?: (sourceCol: number, sourceRow: number, targetCol: number) => void;
  canPickUp?: (col: number, row: number) => boolean;
}

export function useTaskSelection(
  columns: UseTaskSelectionColumn[],
  options?: UseTaskSelectionOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [pickedTask, setPickedTask] = useState<{ col: number; row: number } | null>(null);

  const gridNav = useGridNavigation({
    colCount: columns.length,
    rowCount: (col) => columns[col].tasks.length,
    onActivate: (col, row) => {
      const opts = optionsRef.current;

      if (pickedTask === null) {
        const canPick = opts?.canPickUp?.(col, row) ?? true;
        if (canPick) {
          setPickedTask({ col, row });
        }
      } else if (pickedTask.col !== col) {
        opts?.onMoveTask?.(pickedTask.col, pickedTask.row, col);
        setPickedTask(null);
      } else {
        setPickedTask(null);
      }
    }
  });

  const isPickedTask = useCallback(
    (col: number, row: number) => pickedTask?.col === col && pickedTask?.row === row,
    [pickedTask]
  );

  return {
    ...gridNav,
    isHovering: pickedTask !== null,
    pickedCol: pickedTask?.col ?? null,
    pickedRow: pickedTask?.row ?? null,
    isPickedTask,
  };
}
