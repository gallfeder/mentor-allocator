import {
    Day,
    MentorLessonId,
    Project,
    ProjectId,
    ProjectOverview,
    Student,
    StudentId,
    TeacherId
} from "../../../../shared/types";

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

export interface CreateMentorLessonOptimisticPayload {
    projectId: ProjectId,
    predictedMentorLessonId: MentorLessonId,
    teacherId: TeacherId,
    day: Day,
    lesson: number,
    grade: string
}

export interface CreateMentorLessonSucceededPayload {
    projectId: ProjectId,
    predictedMentorLessonId: MentorLessonId,
    newMentorLessonId: MentorLessonId,
}

export interface SetStudentsPayload {
    projectId: ProjectId,
    students: Student[]
}

export interface DeleteMentorLessonPayload {
    projectId: ProjectId,
    mentorLessonId: MentorLessonId
}

export type MallocAction =
    { type: "INIT_PROJECTS", payload: InitProjectsPayload[] } |
    { type: "INIT_PROJECT", payload: InitProjectPayload } |

    { type: "CREATE_MENTOR_LESSON_OPTIMISTIC", payload: CreateMentorLessonOptimisticPayload } |
    { type: "CREATE_MENTOR_LESSON_SUCCEEDED", payload: CreateMentorLessonSucceededPayload } |
    { type: "CREATE_MENTOR_LESSON_FAILED", payload: DeleteMentorLessonPayload } |

    { type: "SET_STUDENTS", payload: SetStudentsPayload } |

    { type: "ALLOC_STUDENTS", payload: AllocStudentsPayload }
