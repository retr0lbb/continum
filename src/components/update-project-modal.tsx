import { ModalTypeOpen } from "../routes/pages/intialPage";
import { ProjectInfo } from "../types/project.type";
import { validateFolderName } from "../utils/validate-project-name";
import { Modal, ModalContent } from "./modal";


interface UpdateProjectModalProps{
    project: ProjectInfo,
    modalState: ModalTypeOpen,
    closeModal: () => void,
    handleSubmit(newName: string): void
}

function UpdateProjectModalForm({ handleSubmit, projectName, onCancel }: { handleSubmit: (folderName: string) => void, projectName: string, onCancel: () => void }) {
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const folderName = new FormData(e.currentTarget).get("folderName")?.toString();

        const { valid, error } = validateFolderName(folderName ?? "");

        if (!valid) {
            console.log(error);
            return;
        }

        handleSubmit(folderName ?? "");
    }

    return (
        <form className="py-6 flex flex-col px-5 gap-5" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
                <label htmlFor="folderName" className="text-muted-text text-sm">Folder Name</label>
                <input
                    type="text"
                    id="folderName"
                    name="folderName"
                    defaultValue={projectName}
                    className="text-main-text p-2 border border-muted-text/50 rounded-sm focus:border-accent"
                    placeholder="Type your desired name..."
                />
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
                    className="w-full h-full bg-background-main border border-main-text text-main-text py-2 px-4
                        hover:border-accent hover:text-accent transition-all rounded-sm font-medium
                        active:bg-accent active:text-background-main"
                >
                    Confirmar
                </button>
            </div>
        </form>
    )
}

export function UpdateProjectModal(props: UpdateProjectModalProps){

    return(
        <Modal onHide={props.closeModal} isOpen={props.modalState === ModalTypeOpen.UPDATE_TASK}>
            <ModalContent className="flex p-4 flex-col min-h-32 min-w-32 bg-background-main border border-main-text/30 rounded-lg gap-4">
                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-main-text">Update Project</h1>
                    <p className="text-lg text-muted-text">Choose a new name for your project</p>
                </div>

                <UpdateProjectModalForm
                    projectName={props.project.name}
                    handleSubmit={props.handleSubmit}
                    onCancel={props.closeModal}
                />

            </ModalContent>
        </Modal>
    )
}
