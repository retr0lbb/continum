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
          const isPicking = configRef.current.isHovering?.();
          if (!isPicking) {
            let firstCol = 0;
            while (firstCol < configRef.current.colCount && getRowCount(firstCol) === 0) {
              firstCol++;
            }
            if (firstCol >= configRef.current.colCount) return;
            setSelectedCol(firstCol);
            setSelectedRow(0);
          } else {
            setSelectedCol(0);
            setSelectedRow(0);
          }
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
            let newCol = selectedCol + 1;
            const isPicking = configRef.current.isHovering?.();
            while (newCol < colCount && getRowCount(newCol) === 0 && !isPicking) {
              newCol++;
            }
            if (newCol >= colCount) break;
            setSelectedCol(newCol);
            setSelectedRow(Math.min(selectedRow, Math.max(0, getRowCount(newCol) - 1)));
            break;
        }

        case "ArrowLeft": {
            let newCol = selectedCol - 1;
            const isPicking = configRef.current.isHovering?.();
            while (newCol >= 0 && getRowCount(newCol) === 0 && !isPicking) {
              newCol--;
            }
            if (newCol < 0) break;
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
