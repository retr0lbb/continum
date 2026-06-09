---
applyTo: '**'
---

# Specifications for Creating Hooks

## 1. File Organization
- **Each hook gets its own file** inside `src/hooks/`.
- File name must match the hook name in camelCase (e.g., `useTaskSelection` -> `useTaskSelection.ts`).
- Only export one hook per file using a **named export**.

## 2. Hook Definition
- **Hooks must be defined as regular functions** (i.e., `function useHookName() {}`), not as arrow functions.
- Hook names must start with `use` followed by a capital letter.

```typescript
// Correct
export function useTaskSelection(columns: Column[]) { ... }

// Incorrect
export const useTaskSelection = (columns: Column[]) => { ... }
```

## 3. Parameters and Typing
- **All parameters must be properly typed** using TypeScript interfaces or types.
- Define input interfaces at the top of the file, prefixed with the hook name.

```typescript
interface UseTaskSelectionColumn {
  tasks: unknown[]
}

export function useTaskSelection(columns: UseTaskSelectionColumn[]) { ... }
```

## 4. Return Values
- **Return an object** with named properties for clarity and easy destructuring.
- Return only what the consumer needs — avoid exposing internal state setters directly unless necessary.

```typescript
return { selectedCol, selectedRow, handleKeyDown, isSelected }
```

## 5. State Management with `useState`
- Use `useState` for component-level state that belongs to the hook.
- Type the state explicitly, especially when using union types or nullable values.

```typescript
const [selectedCol, setSelectedCol] = useState<number | null>(null)
const [selectedRow, setSelectedRow] = useState<number | null>(null)
```

## 6. Performance with `useCallback`
- Wrap **event handlers** and **callback functions** returned to the consumer in `useCallback` to preserve reference stability.
- Include only the minimal set of dependencies. For external values that are stable or change infrequently, use the **ref pattern** to exclude them from deps:

```typescript
const columnsRef = useRef(columns)
columnsRef.current = columns

const handleKeyDown = useCallback(
  (e: React.KeyboardEvent) => {
    const cols = columnsRef.current
    // cols is always fresh, but handleKeyDown reference stays stable
  },
  [selectedCol, selectedRow] // columns is NOT a dep
)
```

### 6.1 When to use the ref pattern
- When a parameter is a non-primitive (array, object, function) that the consumer might recreate on every render.
- When the value is used **inside** the callback but doesn't need to trigger a callback recreation.

### 6.2 When to include in deps directly
- When the value is a **primitive** (string, number, boolean).
- When the value is a known stable reference (module-level const, React state setter).

## 7. Performance with `useMemo`
- Use `useMemo` for **derived/computed values** that are expensive to calculate.
- Avoid over-optimizing — `useMemo` is not needed for trivial calculations.

```typescript
const totalTasks = useMemo(
  () => columns.reduce((sum, col) => sum + col.tasks.length, 0),
  [columns]
)
```

## 8. Side Effects with `useEffect`
- Only use `useEffect` for **synchronizing with external systems** (browser APIs, subscriptions, etc.).
- Prefer event handlers (`onKeyDown`, `onClick`, etc.) over `useEffect` when React provides a declarative alternative.
- Always clean up subscriptions, listeners, and timers in the cleanup function.

## 9. Custom Hook Composition
- Hooks can call other hooks freely (this is what makes them "hooks").
- Compose small focused hooks into larger ones when needed.

## 10. Reference Pattern Summary

| Pattern | When to Use | Example |
|---------|-------------|---------|
| `useRef` + `useCallback` | Parameters that are non-primitive and consumer-provided | `useTaskSelection(columns)` where `columns` is an array |
| `useCallback` with primitive deps | Values in deps are primitives or stable refs | `isSelected` depending on `selectedCol`, `selectedRow` |
| `useMemo` | Expensive derived calculations | Filtering, sorting, mapping large arrays |
| Inline in render | Trivial calculations, static JSX | — |

---

## 11. Grid Navigation Hook — `useGridNavigation`

**Arquivo:** `src/hooks/useGridNavigation.ts`

Hook genérico para navegação por teclado em grids de 1 ou 2 dimensões.

### Assinatura

```typescript
interface UseGridNavigationConfig {
  colCount: number;
  rowCount: number | ((col: number) => number);
  onActivate?: (col: number, row: number) => void;
}

export function useGridNavigation(
  config: UseGridNavigationConfig
): {
  selectedCol: number | null;
  selectedRow: number | null;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isSelected: (col: number, row: number) => boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `config.colCount` | `number` | Número de colunas do grid |
| `config.rowCount` | `number \| ((col) => number)` | Número de linhas (constante ou por coluna) |
| `config.onActivate` | `(col, row) => void` | Callback chamado ao pressionar Enter |

### Retorno

| Propriedade | Descrição |
|---|---|
| `selectedCol` | Coluna atualmente selecionada (ou `null`) |
| `selectedRow` | Linha atualmente selecionada (ou `null`) |
| `handleKeyDown` | Handler de teclado para espalhar no container |
| `isSelected(col, row)` | Testa se uma célula está selecionada (para uso em `data-selected` e `isSelected` prop) |
| `containerRef` | Ref para espalhar no container (usado no scroll-into-view) |

### Comportamento do Teclado

| Tecla | Ação |
|-------|------|
| `ArrowUp/Down` | Navega verticalmente, respeitando os limites da coluna |
| `ArrowLeft/Right` | Navega horizontalmente, com clamp da linha para os limites da coluna alvo |
| `Enter` | Chama `onActivate(col, row)` |
| Qualquer tecla quando `null,null` | Inicializa seleção em `(0, 0)` |

### Exemplo (1D — lista de projetos)

```typescript
const { handleKeyDown, isSelected, containerRef } = useGridNavigation({
  colCount: 1,
  rowCount: repos.length,
  onActivate: (_col, row) => openProject(repos[row].path),
});
```

### Exemplo (2D — grid de tarefas)

```typescript
const { handleKeyDown, isSelected, containerRef } = useGridNavigation({
  colCount: columns.length,
  rowCount: (col) => columns[col].tasks.length,
});
```

---

## 12. Task Selection Hook — `useTaskSelection`

**Arquivo:** `src/hooks/useTaskSelection.ts`

Wrapper específico para o grid de tarefas. Delega internamente para `useGridNavigation`.

```typescript
interface UseTaskSelectionColumn {
  tasks: unknown[];
}

export function useTaskSelection(
  columns: UseTaskSelectionColumn[]
): // retorno idêntico ao de useGridNavigation
{
  selectedCol: number | null;
  selectedRow: number | null;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isSelected: (col: number, row: number) => boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}
```

---

## 13. Project Selection Hook — `useProjectSelection`

**Arquivo:** `src/hooks/useProjectSelection.ts`

Hook específico para a lista de projetos na `InitialPage`. Delega internamente para `useGridNavigation` com `colCount: 1`.

```typescript
export function useProjectSelection(
  repos: ProjectInfo[],
  onActivate: (repo: ProjectInfo, index: number) => void
): {
  selectedCol: number | null;
  selectedRow: number | null;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isSelected: (col: number, row: number) => boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  selectedRepoIndex: number | null;
}
```

### Como usar na página

```typescript
function InitialPage() {
  const { repos } = useWorkspace();
  const { handleKeyDown, isSelected, containerRef } = useProjectSelection(
    repos,
    (repo) => handleOpenProject(repo.path)
  );

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} tabIndex={0}>
      {repos.map((repo, index) => (
        <div key={repo.path} data-selected={isSelected(0, index) ? "true" : undefined}>
          <ProjectLabel
            name={repo.name}
            onClick={() => handleOpenProject(repo.path)}
            isSelected={isSelected(0, index)}
          />
        </div>
      ))}
    </div>
  );
}
```
