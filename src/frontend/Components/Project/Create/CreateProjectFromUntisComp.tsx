import {Ref, useImperativeHandle, useState} from "react";
import {ImportProjectHandle} from "./CreateProjectModalComp";
import {ProjectId} from "../../../../shared/types";

interface Props {
    ref: Ref<ImportProjectHandle>
    onCreated: (projectId: ProjectId | undefined) => void;
}

const CreateProjectFromUntisComp = (props: Props) => {

    const [projectName, setProjectName] = useState<string>("");

    const [gpu001Path, setGpu001Path] = useState<string>("");
    const [gpu015Path, setGpu015Path] = useState<string>("");

    function createProject(): void {
        window.electronAPI.createProject(projectName, {
            type: "Untis", parameters: {
                pathToGPU001: gpu001Path,
                pathToGPU015: gpu015Path
            }
        }).then((projectId: ProjectId | undefined) => {
            props.onCreated(projectId);
        });
    }

    // eslint-disable-next-line react-hooks/refs
    useImperativeHandle(props.ref, () => ({
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
        <div className="schild-import-type">
            <div className="import-option">
                <h3>Project name</h3>
                <input value={projectName} onChange={(e) => setProjectName(e.currentTarget.value)}
                       className="input" type="text"/>
            </div>

            <br/>

            <div className="path-import">
                <h3>GPU001</h3>
                <button onClick={getGpu001Path} className="button normal">Open file</button>
                <p>{gpu001Path.length === 0 ? "" : `(${gpu001Path})`}</p>
            </div>

            <div className="path-import">
                <h3>GPU015</h3>
                <button onClick={getGpu015Path} className="button normal">Open file</button>
                <p>{gpu015Path.length === 0 ? "" : `(${gpu015Path})`}</p>
            </div>
        </div>
    )

}

export default CreateProjectFromUntisComp;