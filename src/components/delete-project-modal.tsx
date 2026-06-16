import { ModalTypeOpen } from "../routes/pages/intialPage";
import { ProjectInfo } from "../types/project.type";
import { Modal, ModalContent } from "./modal";


interface DeleteProjectModalProps{
    project: ProjectInfo,
    modalState: ModalTypeOpen,
    closeModal: () => void,
    handleSubmit(): void
}

function DeleteProjectModalForm({ handleSubmit, projName,onCancel }: { handleSubmit: () => void, projName: string, onCancel: () => void }) {
    function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        handleSubmit();
    }

    return (
        <form className="py-6 flex flex-col px-5 gap-5" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
                <h1 className="text-xl text-center w-full whitespace-normal text-main-text">Are you certain that you want to delete: <span className="text-accent font-medium">{projName}</span></h1>
            </div>
            <div className="flex items-center justify-center w-full gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full h-full bg-background-main border border-main-text text-main-text py-2 px-4
                        hover:border-accent hover:text-accent transition-all rounded-sm font-medium
                        active:bg-accent active:text-background-main"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="w-full h-full py-2 px-4 rounded-sm font-medium
                        bg-accent text-background-main
                        active:opacity-70"
                >
                    Confirm
                </button>
            </div>
        </form>
    )
}

export function DeleteProjectModal(props: DeleteProjectModalProps){

    return(
        <Modal onHide={props.closeModal} isOpen={props.modalState === ModalTypeOpen.DELETE_TASK}>
            <ModalContent className="flex p-4 flex-col min-h-32 min-w-32 bg-background-main border border-main-text/30 rounded-lg gap-4">
                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-main-text">Project Exclusion</h1>
                </div>

                <DeleteProjectModalForm 
                    projName={props.project.name} 
                    handleSubmit={props.handleSubmit}
                    onCancel={props.closeModal}
                />

            </ModalContent>
        </Modal>
    )
}