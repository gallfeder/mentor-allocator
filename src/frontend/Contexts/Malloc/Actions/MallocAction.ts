import {MentorLessonId, Project, ProjectId, ProjectOverview, StudentId} from "../../../../shared/types";

export interface InitProjectsPayload {
    projectOverview: ProjectOverview
}

export interface InitProjectPayload {
    project: Project;
}

export interface AllocStudentsPayload {
    projectId: ProjectId,
    mentorLessonId: MentorLessonId,
    students: StudentId[]
}

export type MallocAction =
    { type: "INIT_PROJECTS", payload: InitProjectsPayload[] } |
    { type: "INIT_PROJECT", payload: InitProjectPayload } |
    { type: "ALLOC_STUDENTS", payload: AllocStudentsPayload }
