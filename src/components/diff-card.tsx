import { Plus } from "lucide-react";
import { tv } from "tailwind-variants";


interface DiffCardProps{
    text: string,
    variant: "green" | "red"
}

const diffCardVariants = tv({
    base: "flex w-full items-center gap-2 text-main-text px-2 py-1",
    variants: {
        variant: {
            red: "bg-[#E7715F]/30",
            green: "bg-[#7AFF73]/30"
        }
    },

    defaultVariants: {
        variant: "green"
    }
})

export function DiffCard(props: DiffCardProps){
    return(
        <div className={diffCardVariants({variant: props.variant})}>
            <Plus size={16} className="shrink-0" />
            <p className="">{props.text}</p>
        </div>
    )
} 