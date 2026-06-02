import { useState, useCallback, useRef, useEffect } from "react"

interface UseTaskSelectionColumn {
  tasks: unknown[]
}

export function useTaskSelection(columns: UseTaskSelectionColumn[]) {
  /*
    Ref pattern for `columns`.

    `columns` is passed in by the consumer and could be a new array reference on
    every render (if defined inline or if the parent re-renders with a new object).
    If we listed `columns` in useCallback's dependency array, handleKeyDown would
    be recreated each time the reference changes — even when the data is logically
    the same — causing unnecessary re-renders of children that receive it.

    By storing `columns` in a ref, we always read the latest value inside the
    callback (columnsRef.current) without forcing the callback to be a dependency
    of itself. The ref assignment happens every render, so the value is always
    fresh, but the ref object identity is stable for the component's lifetime.
  */
  const columnsRef = useRef(columns)
  columnsRef.current = columns

  /*
    A ref to the outermost DOM node of the consumer's component.

    The consumer spreads `containerRef` onto their root div, and the hook uses it
    in a useEffect to query for the selected element and scroll it into view.
    Using a ref here (instead of document.querySelector) scopes the DOM query and
    avoids depending on global DOM structure — the hook works even if there are
    multiple instances on the same page.
  */
  const containerRef = useRef<HTMLDivElement>(null)

  /*
    Selection state — both are null initially, meaning "nothing selected".

    Initialising as null instead of (0, 0) means that the first arrow press
    "activates" the selection rather than having a pre-existing highlight. This
    gives a cleaner UX: the user doesn't see an unexpected highlighted item when
    the tab first mounts.
  */
  const [selectedCol, setSelectedCol] = useState<number | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  /*
    isSelected is wrapped in useCallback so that when it's passed as a prop to
    TaskCard (e.g. selected={isSelected(colIndex, rowIndex)}), React can see that
    the function identity hasn't changed across renders as long as
    (selectedCol, selectedRow) haven't changed. Without this, every render would
    create a new function reference, potentially breaking memoisation in child
    components like React.memo-wrapped lists.

    The function itself is a simple equality check: it returns true only when
    both coordinates match the current selection state.
  */
  const isSelected = useCallback(
    (col: number, row: number) => selectedCol === col && selectedRow === row,
    [selectedCol, selectedRow]
  )

  /*
    Whenever the selected position changes, attempt to bring that task card
    fully into view within its scrollable column.

    How it works:
    1. The consumer renders data-selected="true" on the selected task card's DOM
       element (a <p> tag inside each column).
    2. This effect runs *after* React commits the new selection to the DOM (which
       is guaranteed by useEffect, not useLayoutEffect).
    3. We query for [data-selected="true"] inside containerRef — this naturally
       finds only the currently selected card because React removes the attribute
       from the previously selected card during reconciliation.
    4. scrollIntoView({ block: "nearest" }) asks the browser to scroll the
       element's nearest scrollable ancestor (which is the column div, since the
       outer container has overflow-hidden) just enough so the element is visible.
       "nearest" means: scroll only if the element is *partially or fully* outside
       the visible area, and scroll the *minimum* distance needed. "center" or
       "start" would always reposition, which is jarring.
  */
  useEffect(() => {
    if (selectedCol === null || selectedRow === null) return
    const el = containerRef.current?.querySelector('[data-selected="true"]')
    el?.scrollIntoView({ block: "nearest" })
  }, [selectedCol, selectedRow])

  /*
    handleKeyDown implements a state machine for grid-based keyboard navigation.

    The "state" is (selectedCol, selectedRow), and each arrow key is a transition:

      ArrowUp:      row -= 1, clamped to 0
      ArrowDown:    row += 1, clamped to column's task count - 1
      ArrowLeft:    col -= 1, row is clamped to the new column's bounds
      ArrowRight:   col += 1, row is clamped to the new column's bounds

    The column bounds clamping on horizontal navigation prevents the user from
    being "stranded" at a row index that doesn't exist in the target column.
    Without this, pressing Right on a tall column then Left to a short column
    would set selectedRow to an out-of-bounds value, breaking further navigation.

    When nothing is selected (both null), the first arrow press initialises the
    selection at (0, 0) — the top-left task.

    Non-arrow keys are ignored early via the guard clause, and preventDefault
    stops the page from scrolling when arrow keys are pressed.
  */
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
