import { tv } from "tailwind-variants";
import { useRef, useEffect, useCallback } from "react";
import { TaskStatus } from "../types/tasks.type";

interface TaskCardProps {
    text: string;
    status: TaskStatus | "create";
    selected?: boolean;
    picked?: boolean;
    className?: string;
    onActivate?: () => void;
    isEditing?: boolean;
    editValue?: string;
    onEditChange?: (value: string) => void;
    onEditConfirm?: () => void;
    onEditCancel?: () => void;
}

const taskCardVariants = tv({
    base: `p-2.5 flex items-center justify-center overflow-hidden 
    w-full rounded-sm text-center cursor-pointer font-medium select-none shrink-0`,
    variants: {
        status: {
            todo: "border border-muted-text text-muted-text",
            doing: "border border-main-text text-main-text",
            done: "text-background-main select-none border bg-accent border-accent",
            create: "border border-dashed border-zinc-800 hover:border-zinc-500 text-muted-text"
        },
        selected: {
            true: "text-accent border-accent transition-all"
        },
        picked: {
            true: "opacity-50 scale-95 transition-all"
        }
    },
    compoundVariants: [
        {
            selected: true,
            status: "done",
            className: "bg-background-main text-accent border-accent transition-all"
        }
    ]
})

const editInputVariants = tv({
    base: `p-2.5 w-full rounded-sm text-center font-medium outline-none bg-transparent`,
    variants: {
        status: {
            todo: "border border-muted-text text-muted-text",
            doing: "border border-main-text text-main-text",
            done: "border border-accent text-background-main",
            create: "border border-dashed border-zinc-800 text-muted-text",
        },
    },
})

export function TaskCard(props: TaskCardProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (props.isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [props.isEditing]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.stopPropagation();
            props.onEditConfirm?.();
        } else if (e.key === "Escape") {
            e.stopPropagation();
            props.onEditCancel?.();
        } else {
            e.stopPropagation();
        }
    }, [props.onEditConfirm, props.onEditCancel]);

    if (props.isEditing) {
        return (
            <input
                ref={inputRef}
                value={props.editValue ?? props.text}
                onChange={(e) => props.onEditChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={props.onEditConfirm}
                className={editInputVariants({
                    status: props.status,
                })}
            />
        );
    }

    return (
        <p
            className={taskCardVariants({
                className: props.className,
                status: props.status,
                selected: props.selected,
                picked: props.picked
            })}
            data-selected={props.selected ? "true" : undefined}
            onClick={props.onActivate}
        >
            {props.text}
        </p>
    )
}