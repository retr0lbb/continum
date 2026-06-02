import { MarkdownEditor } from "../markdownEditor";


export function NotesTab(){
    return(
        <div className="flex flex-1 flex-col">
            <div className="flex flex-1 text-main-text w-full overflow-hidden">
                <MarkdownEditor />
            </div>
        </div>
    )
}