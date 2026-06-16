import { useProjectNotes } from "../../hooks/useProjectNotes";
import { useProject } from "../../stores/project.store";
import { MarkdownEditor } from "../markdownEditor";

interface NotesTabProps{
    isVisible?: boolean
}
export function NotesTab(props: NotesTabProps){
    const { project } = useProject()
        
    if (!project) return

    const {
        isLoading, 
        isSaving, 
        note, 
        setNote
    } = useProjectNotes({projectPath: project.path})

    if(isLoading){
        return <p className="text-main-text">Loading...</p>
    }


    return(
        <div className={`flex flex-1 flex-col overflow-hidden ${!props.isVisible && "hidden"}`}>
            <div className="flex flex-1 text-main-text w-full overflow-hidden">
                <MarkdownEditor value={note ?? ""} onChange={setNote}/>
            </div>
            {isSaving && <p className="text-main-text text-sm px-2 py-1">Saving...</p>}
        </div>
    )
}