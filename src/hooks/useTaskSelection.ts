import { useState, useCallback, useRef } from "react";
import { useGridNavigation } from "./useGridNavigation";

interface UseTaskSelectionColumn {
  tasks: unknown[];
}

interface UseTaskSelectionOptions {
  onMoveTask?: (sourceCol: number, sourceRow: number, targetCol: number) => void;
  canPickUp?: (col: number, row: number) => boolean;
  onActivate?: (col: number, row: number) => void;
  onTaskDelete: (col: number, row: number) => void;
  onTaskEdit?: (col: number, row: number) => void;
}

export function useTaskSelection(
  columns: UseTaskSelectionColumn[],
  options?: UseTaskSelectionOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [pickedTask, setPickedTask] = useState<{ col: number; row: number } | null>(null);

  const handleActivate = useCallback((col: number, row: number) => {
    const opts = optionsRef.current;

    if (pickedTask !== null) {
      if (pickedTask.col !== col) {
        opts?.onMoveTask?.(pickedTask.col, pickedTask.row, col);
      }
      setPickedTask(null);
      return;
    }

    const canPick = opts?.canPickUp?.(col, row) ?? true;

    if (!canPick) {
      opts?.onActivate?.(col, row);
      return;
    }

    setPickedTask({ col, row });
  }, [pickedTask]);

  const gridNav = useGridNavigation({
    colCount: columns.length,
    rowCount: (col) => columns[col].tasks.length,
    onActivate: handleActivate,
    keyBindings: {
      "shift+e": (col, row) => optionsRef.current?.onTaskDelete(col, row),
      "shift+q": (col, row) => optionsRef.current?.onTaskEdit?.(col, row),
    },
    isHovering: () => pickedTask !== null,
  });

  const isPickedTask = useCallback(
    (col: number, row: number) => pickedTask?.col === col && pickedTask?.row === row,
    [pickedTask]
  );

  const deleteTask = useCallback((col: number, row: number) => {
    optionsRef.current?.onTaskDelete(col, row);
  }, []);

  const editTask = useCallback((col: number, row: number) => {
    optionsRef.current?.onTaskEdit?.(col, row);
  }, []);

  return {
    ...gridNav,
    isHovering: pickedTask !== null,
    pickedCol: pickedTask?.col ?? null,
    pickedRow: pickedTask?.row ?? null,
    isPickedTask,
    activateTask: handleActivate,
    deleteTask,
    editTask,
  };
}
