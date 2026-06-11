import { useState, useCallback, useRef } from "react";
import { useGridNavigation } from "./useGridNavigation";

interface UseTaskSelectionColumn {
  tasks: unknown[];
}

interface UseTaskSelectionOptions {
  onMoveTask?: (sourceCol: number, sourceRow: number, targetCol: number) => void;
  canPickUp?: (col: number, row: number) => boolean;
  onActivate?: (col: number, row: number) => void; // <- adiciona
  onTaskDelete: (col: number, row: number) => void;
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

      const canPick = opts?.canPickUp?.(col, row) ?? true;

      if (!canPick) {
        if (pickedTask === null) {
          opts?.onActivate?.(col, row);
        }
        return;
      }


      if (!canPick) {
        opts?.onActivate?.(col, row);
        return;
      }

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
    },
    keyBindings: {
      "shift+e": (col, row) => options?.onTaskDelete(col, row)
    },
    isHovering: () => pickedTask !== null,
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
