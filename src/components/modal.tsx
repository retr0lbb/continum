import { useEffect } from "react"
import { tv } from "tailwind-variants"

interface ModalProps {
    children?: React.ReactNode,
    isOpen?: boolean,
    onHide?: () => void
}

export function Modal({ children, isOpen, onHide }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onHide?.();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onHide]);

    return (
        <div
            className={`w-full h-full absolute inset-0 bg-black/10 backdrop-blur-lg flex items-center justify-center ${!isOpen && "hidden"}`}
            onClick={onHide}
        >
            {children}
        </div>
    )
}

const modalVariants = tv({

})

export function ModalContent({ children, className }: { children?: React.ReactNode, className: string }) {
    return (
        <div
            onClick={e => e.stopPropagation()} // impede o clique de chegar no overlay
            className={modalVariants({className})}
        >
            {children}
        </div>
    )
}