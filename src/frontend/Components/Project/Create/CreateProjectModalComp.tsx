import Modal from "../../Generic/Modal/Modal";
import {Dispatch, Ref, SetStateAction, useRef, useState} from "react";
import {ImportType} from "../../../../shared/import";
import "./CreateProjectModal.css"
import CreateProjectFromSchildComp from "./CreateProjectFromSchildComp";
import {ProjectId} from "../../../../shared/types";
import {useNavigate} from "react-router-dom";
import CreateProjectFromUntisComp from "./CreateProjectFromUntisComp";
import CreateCustomProjectComp from "./CreateCustomProjectComp";

interface Props {
    onClosed: () => void;
}

export interface ImportProjectHandle {
    createProject: () => Promise<void> | void;
}

export interface CreateProjectCompProps {
    projectName: string;
    setProjectName: Dispatch<SetStateAction<string>>;
    setCanCreateProject: Dispatch<SetStateAction<boolean>>;
    ref: Ref<ImportProjectHandle>;
    onCreated: (projectId: ProjectId | undefined) => void;
}

const CreateProjectModalComp = (props: Props) => {

    const [importType, setImportType] = useState<ImportType | undefined>(undefined);
    const [canCreateProject, setCanCreateProject] = useState<boolean>(false);
    const navigate = useNavigate();
    const activeImportRef = useRef<ImportProjectHandle | null>(null);

    const [projectName, setProjectName] = useState<string>("");
    
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

    function onCancelPressed() {
        if (importType !== undefined) {
            setImportType(undefined);
            return;
        }

        props.onClosed();
    }

    return (
        <Modal onClosed={props.onClosed} modalSize="modal-medium"
               header={
                    <>
                        <h2>{ importType === "SchILD" ? "Import from SchILD" : importType === "Untis" ? "Import from untis" : "Select project type"}</h2>
                    </>
               }
               footer={
                   ( importType && (
                        <div className="create-project-modal-footer">
                            <button disabled={!canCreateProject} onClick={createProject} className="create-project button primary">Create project</button>
                            <button onClick={onCancelPressed} className="button normal">Cancel</button>
                        </div>
                   ) )
               }>
            <>
                {   importType === "Custom" ? (
                    <CreateCustomProjectComp setCanCreateProject={setCanCreateProject} projectName={projectName} setProjectName={setProjectName} onCreated={onProjectCreated} ref={activeImportRef}/>
                ) : importType === "SchILD" ? (
                    <CreateProjectFromSchildComp setCanCreateProject={setCanCreateProject} projectName={projectName} setProjectName={setProjectName} onCreated={onProjectCreated} ref={activeImportRef}/>
                ) : importType === "Untis" ? (
                    <CreateProjectFromUntisComp setCanCreateProject={setCanCreateProject} projectName={projectName} setProjectName={setProjectName} onCreated={onProjectCreated} ref={activeImportRef}/>
                ) : (
                    <div className="import-type-selectors">
                        <div onClick={() => setImportType("Custom")} className="import-type-selector button">
                            <p>Custom</p>
                        </div>
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