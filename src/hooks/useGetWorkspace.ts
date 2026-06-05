import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export function useWorkspace() {
    const [workspace, setWorkspace] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function selectWorkspace() {
        try {
            setLoading(true);
            const path = await invoke<string | null>("select_workspace");
            setWorkspace(path);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return { workspace, loading, selectWorkspace };
}