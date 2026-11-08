import { MallocState, StateProject } from "../../../../Models/States/MallocState";
import { InitProjectPayload } from "../MallocAction";
import { ProjectId } from "../../../../../shared/types";

const initProjectsAction = (state: MallocState, payload: InitProjectPayload[]): MallocState => {

    const projects: Map<ProjectId, StateProject> = new Map();
    for (const initProjectPayload of payload) {
        projects.set(initProjectPayload.projectId, {
            id: initProjectPayload.projectId,
            name: initProjectPayload.projectName,
            dataVersion: 1,
            students: new Map(),
            courses: [],
            teachers: new Map(),
            mentorLessons: new Map()
        })
    }

    return {
        ...state,
        projects: projects,
    };

}

export default initProjectsAction;