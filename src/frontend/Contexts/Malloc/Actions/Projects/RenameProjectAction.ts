import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {RenameProjectPayload} from "../MallocAction";
import {ProjectId} from "../../../../../shared/types";

const RenameProjectAction = (state: MallocState, payload: RenameProjectPayload): MallocState => {

    const stateProject: StateProject | undefined = state.projects.get(payload.projectId);
    if (!stateProject) {
        return { ...state };
    }

    const projects: Map<ProjectId, StateProject> = new Map(state.projects);

    stateProject.name = payload.name;
    projects.set(payload.projectId, stateProject);

    return {
        ...state,
        projects: projects
    }

}

export default RenameProjectAction;