import { invoke } from "@tauri-apps/api/core";

export function WorkspaceButton() {

    async function handleSelectWorkspace() {
        try {
            console.log("HEY");
            const workspace = await invoke("select_workspace");
            console.log("workspace:", workspace);

            const hey = await invoke("greet", { name: "World" });
            console.log("greet:", hey);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return <button
        className="w-1/4 h-24 rounded-md bg-main-text/5 hover:bg-main-text/10 p-2 transition-colors"
        onClick={handleSelectWorkspace}
    >
        <p className="text-main-text">Abrir Workspace</p>
    </button>
}