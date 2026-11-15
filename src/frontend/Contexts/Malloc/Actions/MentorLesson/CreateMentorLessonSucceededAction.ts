import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {CreateMentorLessonSucceededPayload} from "../MallocAction";
import {MentorLesson, ProjectId} from "../../../../../shared/types";

const createMentorLessonSucceededAction = (state: MallocState, payload: CreateMentorLessonSucceededPayload): MallocState => {

    const stateProject: StateProject | undefined = state.projects.get(payload.projectId);
    if (!stateProject) {
        return { ...state };
    }

    const mentorLesson: MentorLesson | undefined = stateProject.mentorLessons.get(payload.predictedMentorLessonId);
    if (!mentorLesson) {
        return { ...state };
    }

    mentorLesson.id = payload.newMentorLessonId;
    stateProject.mentorLessons.delete(payload.predictedMentorLessonId);
    stateProject.mentorLessons.set(payload.newMentorLessonId, mentorLesson);

    const projects: Map<ProjectId, StateProject> = new Map(state.projects);
    projects.set(payload.projectId, stateProject);

    return {
        ...state,
        projects: projects
    }
}

export default createMentorLessonSucceededAction;