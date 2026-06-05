import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";


interface WorkspaceButtonProps{
    onClick: () => void,
    isVisible?: boolean
}
export function WorkspaceButton(props: WorkspaceButtonProps) {


    return <button
        className={`absolute inset-0 rounded-md bg-main-text/5 hover:bg-main-text/10 p-2 transition-colors z-10 ${props.isVisible && "hidden"}`}
        onClick={props.onClick}
    >
        <p className="text-main-text">Abrir Workspace</p>
    </button>
}