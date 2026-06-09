import { tv } from "tailwind-variants"
import { ChevronRight } from "lucide-react"

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const textVariant = tv({
    base: "text-main-text text-lg font-medium",
    variants: {
        selected: {
            true: "text-accent underline underline-offset-2 text-lg font-medium"
        }
    }

})

const iconVariant = tv({
    base: "size-5 overflow-hidden flex items-center justify-center text-accent opacity-0",
    variants: {
        selected: {
            true: "opacity-100",
            false: "opacity-0"
        }
    },
    defaultVariants: {
        selected: false
    }
})

interface ProjectLabelProps {
    name: string
    lastUpdate: string
    isSelected?: boolean,
    onClick: () => void
}

export function ProjectLabel(props: ProjectLabelProps) {
    return (
        <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={props.onClick}>
            <div className={iconVariant({ selected: props.isSelected })} >
                <ChevronRight />
            </div>

            <p className={textVariant({ selected: props.isSelected })}>{props.name}</p>
            <p className="text-muted-text pl-2">{dayjs(props.lastUpdate).fromNow()} dias atrás</p>
        </div>
    )
}