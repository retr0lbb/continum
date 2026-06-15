import { invoke } from "@tauri-apps/api/core";
import { useState, useCallback, useEffect, useRef } from "react";

interface useProjectNotes {
    projectPath: string;
}

export function useProjectNotes({ projectPath }: useProjectNotes) {
    const [note, setNote] = useState<string | null>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const isFirstLoad = useRef(false);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await invoke<string>("read_project_notes", { projectPath: projectPath });
            setNote(data);
            isFirstLoad.current = true;
        } catch (err) {
            setError(String(err));
        } finally {
            setIsLoading(false);
        }
    }, [projectPath]);


    const saveNote = useCallback(async () => {
        setIsSaving(true)
        try {
            await invoke("save_project_notes", { projectPath, note });
        } catch (err) {
            setError(String(err));
        }finally{
            setIsSaving(false)
        }
    }, [projectPath, note]);


    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        if (!isFirstLoad.current || note === null || note === undefined) return;

        const timer = setTimeout(() => {
            saveNote();
        }, 5000);

        return () => clearTimeout(timer);
    }, [note, saveNote]);

    return {fetchNotes, saveNote, setNote, isLoading, error, isSaving, note};
}