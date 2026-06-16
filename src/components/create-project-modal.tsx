import { ModalTypeOpen } from "../routes/pages/intialPage";
import { Modal, ModalContent } from "./modal";


interface CreateProjectModal{
    modalState: ModalTypeOpen,
    closeModal: () => void,
    handleSubmit(folderName: string): void
}

function CreateProjectModalForm({ handleSubmit }: { handleSubmit: (folderName: string) => void }) {
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const folderName = new FormData(e.currentTarget).get("folderName");

        if (!folderName) {
            console.log("Impossivel pasta sem nome");
            return;
        }

        handleSubmit(folderName.toString());
    }

    return (
        <form className="py-6 flex flex-col px-5 gap-5" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
                <label htmlFor="folderName" className="text-muted-text text-sm">Folder Name</label>
                <input
                    type="text"
                    id="folderName"
                    name="folderName"
                    className="text-main-text p-2 border border-muted-text/50 rounded-sm focus:border-accent"
                    placeholder="Type your desired name..."
                />
            </div>
            <div className="flex items-center justify-center w-full">
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

export function CreateProjectModal(props: CreateProjectModal){

    return(
        <Modal onHide={props.closeModal} isOpen={props.modalState === ModalTypeOpen.CREATE_TASK}>
            <ModalContent className="flex p-4 flex-col min-h-32 min-w-32 bg-background-main border border-main-text/30 rounded-lg gap-4">
                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-main-text">Create a new Project</h1>
                    <p className="text-lg text-muted-text">Creates a new folder and initializes a project</p>
                </div>

                <CreateProjectModalForm handleSubmit={props.handleSubmit}/>

            </ModalContent>
        </Modal>
    )
}