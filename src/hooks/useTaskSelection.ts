import { useState, useCallback, useRef, useEffect } from "react"

interface UseTaskSelectionColumn {
  tasks: unknown[]
}

export function useTaskSelection(columns: UseTaskSelectionColumn[]) {
  const columnsRef = useRef(columns)
  columnsRef.current = columns

  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedCol, setSelectedCol] = useState<number | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  const isSelected = useCallback(
    (col: number, row: number) => selectedCol === col && selectedRow === row,
    [selectedCol, selectedRow]
  )

  useEffect(() => {
    if (selectedCol === null || selectedRow === null) return
    const el = containerRef.current?.querySelector('[data-selected="true"]')
    el?.scrollIntoView({ block: "nearest" })
  }, [selectedCol, selectedRow])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return
      e.preventDefault()

      if (selectedCol === null || selectedRow === null) {
        setSelectedCol(0)
        setSelectedRow(0)
        return
      }

      const cols = columnsRef.current

      switch (e.key) {
        case "ArrowUp":
          setSelectedRow(Math.max(0, selectedRow - 1))
          break
        case "ArrowDown":
          setSelectedRow(Math.min(cols[selectedCol].tasks.length - 1, selectedRow + 1))
          break
        case "ArrowLeft": {
          const newCol = Math.max(0, selectedCol - 1)
          setSelectedCol(newCol)
          setSelectedRow(Math.min(selectedRow, cols[newCol].tasks.length - 1))
          break
        }
        case "ArrowRight": {
          const newCol = Math.min(cols.length - 1, selectedCol + 1)
          setSelectedCol(newCol)
          setSelectedRow(Math.min(selectedRow, cols[newCol].tasks.length - 1))
          break
        }
      }
    },
    [selectedCol, selectedRow]
  )

  return { selectedCol, selectedRow, handleKeyDown, isSelected, containerRef }
}
