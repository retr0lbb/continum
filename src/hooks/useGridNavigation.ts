import { useState, useCallback, useRef, useEffect } from "react";

interface UseGridNavigationConfig {
  colCount: number;
  rowCount: number | ((col: number) => number);
  onActivate?: (col: number, row: number) => void;
}

export function useGridNavigation(config: UseGridNavigationConfig) {
  const configRef = useRef(config);
  configRef.current = config;

  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const getRowCount = useCallback((col: number) => {
    const rc = configRef.current.rowCount;
    return typeof rc === "function" ? rc(col) : rc;
  }, []);

  const isSelected = useCallback(
    (col: number, row: number) => selectedCol === col && selectedRow === row,
    [selectedCol, selectedRow]
  );

  useEffect(() => {
    if (selectedCol === null || selectedRow === null) return;
    const el = containerRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedCol, selectedRow]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) return;
      e.preventDefault();

      if (selectedCol === null || selectedRow === null) {
        setSelectedCol(0);
        setSelectedRow(0);
        return;
      }

      const { colCount } = configRef.current;

      switch (e.key) {
        case "ArrowUp":
          setSelectedRow(Math.max(0, selectedRow - 1));
          break;
        case "ArrowDown":
          setSelectedRow(Math.min(getRowCount(selectedCol) - 1, selectedRow + 1));
          break;
        case "ArrowLeft": {
          const newCol = Math.max(0, selectedCol - 1);
          setSelectedCol(newCol);
          setSelectedRow(Math.min(selectedRow, getRowCount(newCol) - 1));
          break;
        }
        case "ArrowRight": {
          const newCol = Math.min(colCount - 1, selectedCol + 1);
          setSelectedCol(newCol);
          setSelectedRow(Math.min(selectedRow, getRowCount(newCol) - 1));
          break;
        }
        case "Enter":
          configRef.current.onActivate?.(selectedCol, selectedRow);
          break;
      }
    },
    [selectedCol, selectedRow, getRowCount]
  );

  return { selectedCol, selectedRow, handleKeyDown, isSelected, containerRef };
}
