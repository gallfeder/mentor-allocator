import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {DeleteMentorLessonPayload} from "../MallocAction";
import {ProjectId} from "../../../../../shared/types";

const deleteMentorLessonAction = (state: MallocState, payload: DeleteMentorLessonPayload): MallocState => {

    const stateProject: StateProject | undefined = state.projects.get(payload.projectId);
    if (!stateProject) {
        return { ...state };
    }

    stateProject.mentorLessons.delete(payload.mentorLessonId);

    const projects: Map<ProjectId, StateProject> = new Map(state.projects);
    projects.set(payload.projectId, stateProject);

    return {
        ...state,
        projects: projects
    }

}

export default deleteMentorLessonAction;