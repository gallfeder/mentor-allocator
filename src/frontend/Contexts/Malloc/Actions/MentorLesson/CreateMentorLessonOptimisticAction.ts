import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {CreateMentorLessonOptimisticPayload} from "../MallocAction";
import {ProjectId} from "../../../../../shared/types";

const createMentorLessonOptimisticAction = (state: MallocState, payload: CreateMentorLessonOptimisticPayload): MallocState => {

    const stateProject: StateProject | undefined = state.projects.get(payload.projectId);
    if (!stateProject) {
        return { ...state };
    }

    stateProject.mentorLessons.set(payload.predictedMentorLessonId, {
        id: payload.predictedMentorLessonId,
        day: payload.day,
        lesson: payload.lesson,
        teacherId: payload.teacherId,
        grade: payload.grade
    });

    const projects: Map<ProjectId, StateProject> = new Map(state.projects);
    projects.set(payload.projectId, stateProject);

    return {
        ...state,
        projects: projects
    }

}

export default createMentorLessonOptimisticAction;