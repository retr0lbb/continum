import { useState, useCallback, useRef, useEffect } from "react";

type KeyHandler = (col: number, row: number, e: React.KeyboardEvent) => void;

interface UseGridNavigationConfig {
  colCount: number;
  rowCount: number | ((col: number) => number);
  onActivate?: (col: number, row: number) => void;
  keyBindings?: Record<string, KeyHandler>
  isHovering?: () => boolean; // <- adiciona
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

      if(selectedCol === null || selectedRow === null){
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)){
          e.preventDefault();
          setSelectedCol(0);
          setSelectedRow(0);
        }
        return
      }

      const keyId = [
        e.ctrlKey && "ctrl",
        e.shiftKey && "shift",
        e.altKey && "alt",
        e.key.toLowerCase()
      ].filter(Boolean).join("+")

      const customBinding = configRef.current.keyBindings?.[keyId]

      if(customBinding){
        e.preventDefault()
        customBinding(selectedCol, selectedRow, e)
        return;
      }

      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) return;
      e.preventDefault();

      const { colCount } = configRef.current;

      switch (e.key) {
        case "ArrowUp":
          setSelectedRow(Math.max(0, selectedRow - 1));
          break;
        case "ArrowDown":
          setSelectedRow(Math.min(getRowCount(selectedCol) - 1, selectedRow + 1));
          break;

        case "ArrowRight": {
            const newCol = Math.min(colCount - 1, selectedCol + 1);
            const isEmpty = getRowCount(newCol) === 0;
            const isPicking = configRef.current.isHovering?.(); // <- precisamos disso
            if (isEmpty && !isPicking) break;
            setSelectedCol(newCol);
            setSelectedRow(Math.min(selectedRow, Math.max(0, getRowCount(newCol) - 1)));
            break;
        }

        case "ArrowLeft": {
            const newCol = Math.max(0, selectedCol - 1);
            const isEmpty = getRowCount(newCol) === 0;
            const isPicking = configRef.current.isHovering?.();
            if (isEmpty && !isPicking) break;
            setSelectedCol(newCol);
            setSelectedRow(Math.min(selectedRow, Math.max(0, getRowCount(newCol) - 1)));
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
