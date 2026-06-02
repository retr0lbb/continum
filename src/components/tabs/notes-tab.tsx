import { MarkdownEditor } from "../markdownEditor";

interface NotesTabProps{
    isVisible?: boolean
}
export function NotesTab(props: NotesTabProps){
    return(
        <div className={`flex flex-1 flex-col ${!props.isVisible && "hidden"}`}>
            <div className="flex flex-1 text-main-text w-full overflow-hidden">
                <MarkdownEditor />
            </div>
        </div>
    )
}