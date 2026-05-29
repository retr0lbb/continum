import { tv } from "tailwind-variants"

interface TabSwitcherProps {
    children: React.ReactNode
}

export function TabSwitcher(props: TabSwitcherProps){
    return (
        <div className="flex items-center justify-start px-3 py-0.5 gap-4">
            {props.children}
        </div>
    )
}

interface TabProps{
    name: string,
    isSelected?: boolean
}

const tabVariant = tv({
    base: "text-lg text-main-text p-2 cursor-pointer hover:text-accent transition-all",

    variants: {
        isSelected: {
            true: "text-accent underline underline-offset-3"
        }
    }
})

export function Tab(props: TabProps){
    return(
        <>
            <p className={tabVariant({isSelected: props.isSelected})}>{props.name}</p>
            <div className="h-full w-0.5 bg-main-text/10 rounded-full" />
        </>
    )
}