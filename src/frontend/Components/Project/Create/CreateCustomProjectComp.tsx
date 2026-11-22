import {CreateProjectCompProps} from "./CreateProjectModalComp";
import {useEffect, useImperativeHandle} from "react";
import {ProjectId} from "../../../../shared/types";

const CreateCustomProjectComp = ({ setCanCreateProject, projectName, setProjectName, onCreated, ref }: CreateProjectCompProps) => {

    function createProject(): void {
        window.electronAPI.createProject(projectName).then((projectId: ProjectId | undefined) => {
            onCreated(projectId);
        });
    }

    useEffect(() => {
        setCanCreateProject(projectName.trim().length > 0);
    }, [setCanCreateProject, projectName]);

    useImperativeHandle(ref, () => ({
        createProject
    }));

    return (
        <div className="custom-import-type">
            <div className="form-row import-option">
                <div className="required-field">
                    <h3>Project name</h3>
                    <p>*</p>
                </div>
                <input value={projectName} onChange={(e) => setProjectName(e.currentTarget.value)}
                       className="input" type="text" placeholder="Project name"/>
            </div>
        </div>
    )

}

export default CreateCustomProjectComp;