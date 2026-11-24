import ThemeSwitcherComp from "../../Theme/ThemeSwitcherComp";
import {useNavigate, useParams} from "react-router-dom";
import {MallocState, StateProject} from "../../../Models/States/MallocState";
import {useMallocDispatch, useMallocState} from "../../../Models/States/Hooks";
import {ProjectId} from "../../../../shared/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import arrowBackIcon from "../../../public/arrow-back.svg"
import {useEffect, useRef, useState} from "react";

const ProjectHeaderComp = () => {

    const navigate = useNavigate();
    const mallocState: MallocState = useMallocState();
    const mallocDispatch = useMallocDispatch();
    const { projectId } = useParams();

    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const projectNameRef = useRef<HTMLInputElement | null>(null);

    const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);

    function backToHomepage() {
        navigate("/");
    }

    function editProjectName(): void {
        setIsEditingName(true);
    }

    async function onInputLostFocus() {
        if (!projectNameRef.current || !stateProject) {
            return;
        }

        const newProjectName: string = projectNameRef.current.value;
        if (newProjectName.trim().length <= 0) {
            return;
        }

        const oldName: string = stateProject.name;

        mallocDispatch!({ type: "RENAME_PROJECT", payload: { projectId: projectId as ProjectId, name: newProjectName } });
        const success: boolean = await window.electronAPI.editProjectName(projectId as ProjectId, newProjectName);
        if (!success) {
            mallocDispatch!({ type: "RENAME_PROJECT", payload: { projectId: projectId as ProjectId, name: oldName } });
        }

        setIsEditingName(false);
    }

    useEffect(() => {
        if (isEditingName) {
            projectNameRef.current?.focus();
        }
    }, [isEditingName])

    return (
        <nav className="header panel">
            <div className="header-left">
                <img onClick={backToHomepage} className="header-back-button icon clickable" height="32px" src={arrowBackIcon} alt=""/>
                { isEditingName ? (
                    <input ref={projectNameRef} type="text" onBlur={onInputLostFocus} defaultValue={stateProject?.name}/>
                ) : (
                    <h2 onClick={editProjectName}>{stateProject?.name ?? "Loading project..."}</h2>
                )}
            </div>
            <ThemeSwitcherComp/>
        </nav>
    )

}

export default ProjectHeaderComp;