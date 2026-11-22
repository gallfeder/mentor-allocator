import {useState} from "react";
import {createPortal} from "react-dom";
import CreateProjectModalComp from "../Project/Create/CreateProjectModalComp";

const CreateProjectComp = () => {

    const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);

    function onCreatePressed() {
        setIsCreatingProject(true);
    }

    return (
        <div onClick={onCreatePressed} className="project-card create button">
            <h3>Create project</h3>
            { isCreatingProject && createPortal(<CreateProjectModalComp onClosed={() => setIsCreatingProject(false)}/>, document.body) }
        </div>
    )

}

export default CreateProjectComp;