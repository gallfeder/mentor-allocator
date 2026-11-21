import Modal from "../../Generic/Modal/Modal";
import {useRef, useState} from "react";
import {ImportType} from "../../../../shared/import";
import "./CreateProjectModal.css"
import CreateProjectFromSchildComp from "./CreateProjectFromSchildComp";
import {ProjectId} from "../../../../shared/types";
import {useNavigate} from "react-router-dom";
import CreateProjectFromUntisComp from "./CreateProjectFromUntisComp";

interface Props {
    onClosed: () => void;
}

export interface ImportProjectHandle {
    createProject: () => Promise<void> | void;
}

const CreateProjectModalComp = (props: Props) => {

    const [importType, setImportType] = useState<ImportType | undefined>(undefined);
    const navigate = useNavigate();
    const activeImportRef = useRef<ImportProjectHandle | null>(null);

    function onProjectCreated(projectId: ProjectId | undefined) {
        if (!projectId) {
            props.onClosed();
            return;
        }

        navigate(`projects/${projectId}`);
    }

    function createProject() {
        activeImportRef.current?.createProject();
    }

    return (
        <Modal onClosed={props.onClosed} modalSize="modal-medium"
               header={
                    <>
                        <h2>{ importType === "SchILD" ? "Import from SchILD" : importType === "Untis" ? "Import from untis" : "Select import type"}</h2>
                    </>
               }
               footer={
                   ( importType && (
                        <div className="create-project-modal-footer">
                            <button onClick={createProject} className="button primary">Create project</button>
                            <button className="button normal">Cancel</button>
                        </div>
                   ) )
               }>
            <>
                { importType === "SchILD" ? (
                    <CreateProjectFromSchildComp onCreated={onProjectCreated} ref={activeImportRef}/>
                ) : importType === "Untis" ? (
                    <CreateProjectFromUntisComp onCreated={onProjectCreated} ref={activeImportRef}/>
                ) : (
                    <div className="import-type-selectors">
                        <div onClick={() => setImportType("SchILD")} className="import-type-selector button">
                            <p>SchILD</p>
                        </div>
                        <div onClick={() => setImportType("Untis")} className="import-type-selector button">
                            <p>Untis</p>
                        </div>
                    </div>
                )}
            </>
        </Modal>
    )

}

export default CreateProjectModalComp;