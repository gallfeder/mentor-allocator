import {useEffect, useImperativeHandle, useState} from "react";
import {CreateProjectCompProps} from "./CreateProjectModalComp";
import {ProjectId} from "../../../../shared/types";

const CreateProjectFromUntisComp = ({ setCanCreateProject, projectName, setProjectName, onCreated, ref }: CreateProjectCompProps) => {

    const [gpu001Path, setGpu001Path] = useState<string>("");
    const [gpu015Path, setGpu015Path] = useState<string>("");

    function createProject(): void {
        window.electronAPI.createProject(projectName, {
            type: "Untis", parameters: {
                pathToGPU001: gpu001Path,
                pathToGPU015: gpu015Path
            }
        }).then((projectId: ProjectId | undefined) => {
            onCreated(projectId);
        });
    }

    useEffect(() => {
        setCanCreateProject(projectName.trim().length > 0 && gpu001Path.trim().length > 0 && gpu015Path.trim().length > 0);
    }, [setCanCreateProject, projectName, gpu001Path, gpu015Path]);

    useImperativeHandle(ref, () => ({
        createProject
    }));

    async function getGpu001Path() {
        const path: string | undefined = await window.electronAPI.getFilePathFromUser("GPU001");
        if (!path) {
            return;
        }

        setGpu001Path(path);
    }

    async function getGpu015Path() {
        const path: string | undefined = await window.electronAPI.getFilePathFromUser("GPU015");
        if (!path) {
            return;
        }

        setGpu015Path(path);
    }

    return (
        <div className="untis-import-type">
            <div className="form-row import-option">
                <h3>Project name<span className="required-field">*</span></h3>
                <input value={projectName} onChange={(e) => setProjectName(e.currentTarget.value)}
                       className="input" type="text" placeholder="Project name"/>
            </div>

            <div className="form-row path-import">
                <h3>GPU001<span className="required-field">*</span></h3>
                <button onClick={getGpu001Path} className="button normal">Open file</button>
                <p>{gpu001Path.length === 0 ? "" : `(${gpu001Path})`}</p>
            </div>

            <div className="form-row path-import">
                <h3>GPU015<span className="required-field">*</span></h3>
                <button onClick={getGpu015Path} className="button normal">Open file</button>
                <p>{gpu015Path.length === 0 ? "" : `(${gpu015Path})`}</p>
            </div>
        </div>
    )

}

export default CreateProjectFromUntisComp;