import {useMallocState} from "../../Models/States/Hooks";
import {MallocState, StateProject} from "../../Models/States/MallocState";
import {ProjectId} from "../../../shared/types";

interface Props {
    projectId: ProjectId;
}

const ProjectCardComp = (props: Props) => {

    const mallocState: MallocState = useMallocState();
    const project: StateProject | undefined = mallocState.projects.get(props.projectId);

    if (!project) {
        return null;
    }

    return (
        <div className="project-card">
            <h3>{project.name}</h3>
        </div>
    )

}

export default ProjectCardComp;