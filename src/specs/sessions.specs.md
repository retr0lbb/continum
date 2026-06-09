---
applyTo: '**'
---

# Sessions — Hook, Store e Fluxo de Integração

## 1. Visão Geral

Sessões registram o tempo de uso de workspaces e projetos. Cada vez que um
workspace é aberto, uma nova sessão é criada (`sessions.json` na raiz do
workspace). Cada vez que um projeto é aberto, outra sessão é criada
(`.continum/sessions.json` dentro do projeto).

## 2. Hook `useSessions`

**Arquivo:** `src/hooks/useSessions.ts`

### Assinatura

```typescript
export function useSessions(): {
  openWorkspaceSession: (wsPath: string) => Promise<void>;
  closeWorkspaceSession: (wsPath: string) => Promise<void>;
  openProjectSession: (projectPath: string) => Promise<void>;
  closeProjectSession: (projectPath: string) => Promise<void>;
}
```

### Comportamento

| Função | Comando Tauri | Efeito |
|---|---|---|
| `openWorkspaceSession(wsPath)` | `open_ws_session` | Adiciona `{ start: agora, end: null }` em `wsPath/sessions.json` |
| `closeWorkspaceSession(wsPath)` | `close_ws_session` | Seta `end` da última sessão aberta em `wsPath/sessions.json` |
| `openProjectSession(projectPath)` | `open_project_session` | Adiciona `{ start: agora, end: null }` em `projectPath/.continum/sessions.json` |
| `closeProjectSession(projectPath)` | `close_project_session` | Seta `end` da última sessão aberta em `projectPath/.continum/sessions.json` |

Todas as funções são estáveis (envolvidas em `useCallback` com `[]` de deps).

## 3. Store `useSessionStore`

**Arquivo:** `src/stores/session.store.ts`

### Estado

```typescript
interface SessionStore {
  activeWorkspacePath: string | null;
  activeProjectPath: string | null;
  workspaceSessionStart: string | null;
  projectSessionStart: string | null;
  // + setters e clearers
}
```

### Finalidade

Manter em memória o estado da sessão **ativa** no momento, para que
componentes como `ActiveCounter` possam consultar quando a sessão começou sem
precisar ler o disco.

## 4. Fluxo de Integração

```
┌────────────────────────────────────────────────────────────────────┐
│ Abrir workspace (loadWorkspace / selectWorkspace)                  │
│                                                                    │
│  1. Se activeWorkspacePath existir → closeWorkspaceSession(path)   │
│  2. openWorkspaceSession(novoPath)                                 │
│  3. store.setActiveWorkspacePath(novoPath)                         │
│  4. store.setWorkspaceSessionStart(now)                            │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Abrir projeto (initProject / openProject)                        │
│                                                                  │
│  1. openProjectSession(projectPath)                              │
│  2. store.setActiveProjectPath(projectPath)                      │
│  3. store.setProjectSessionStart(now)                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Voltar da MainPage para InitialPage (returnToMain)              │
│                                                                  │
│  1. closeProjectSession(activeProjectPath)                      │
│  2. store.clearProjectSession()                                 │
│  3. setProject(null)                                             │
│  4. navigate("/")                                                │
└──────────────────────────────────────────────────────────────────┘
```

## 5. Pontos de Integração no Código

| Arquivo | Onde | O quê |
|---|---|---|
| `src/hooks/useWorkspaces.ts` | `loadWorkspace()` / `selectWorkspace()` | Abrir sessão do workspace (fechar anterior se houver) |
| `src/hooks/useWorkspaces.ts` | `initProject()` / `openProject()` | Abrir sessão do projeto |
| `src/routes/pages/mainPage.tsx` | `returnToMain()` | Fechar sessão do projeto |

## 6. Exemplo de Uso

```typescript
import { useSessionStore } from "../../stores/session.store";

function ActiveSessionBadge() {
  const workspaceSessionStart = useSessionStore((s) => s.workspaceSessionStart);
  const projectSessionStart = useSessionStore((s) => s.projectSessionStart);

  if (!workspaceSessionStart) return null;

  return (
    <span>
      Workspace ativo desde {new Date(workspaceSessionStart).toLocaleTimeString()}
    </span>
  );
}
```
