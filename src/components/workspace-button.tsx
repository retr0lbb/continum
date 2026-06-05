
interface WorkspaceButtonProps{
    onClick: () => void,
    children: React.ReactNode
}
export function WorkspaceButton(props: WorkspaceButtonProps) {


    return <button
        className={`flex items-center justify-center gap-2 px-1 cursor-pointer`}
        onClick={props.onClick}
    >
        {props.children}
    </button>
}