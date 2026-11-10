import { MallocState, StateProject } from "../../../../Models/States/MallocState";
import { InitProjectsPayload } from "../MallocAction";
import { ProjectId } from "../../../../../shared/types";

const initProjectsAction = (state: MallocState, payload: InitProjectsPayload[]): MallocState => {

    const projects: Map<ProjectId, StateProject> = new Map();
    for (const initProjectPayload of payload) {
        projects.set(initProjectPayload.projectOverview.id, {
            id: initProjectPayload.projectOverview.id,
            name: initProjectPayload.projectOverview.name,
            lastEdit: initProjectPayload.projectOverview.lastEditDate,
            dataVersion: -1,
            students: new Map(),
            courses: new Map(),
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