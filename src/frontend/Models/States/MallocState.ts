import {
    Course,
    MentorLesson,
    MentorLessonId,
    ProjectId,
    Student,
    StudentId,
    Teacher,
    TeacherId
} from "../../../shared/types";

export interface MallocState {
    projects: Map<ProjectId, StateProject>
}

export const MallocDefaultState: MallocState = {
    projects: new Map()
}

export interface StateProject {
    id: ProjectId;
    name: string;
    dataVersion: number;
    students: Map<StudentId, Student>;
    courses: Course[];
    teachers: Map<TeacherId, Teacher>;
    mentorLessons: Map<MentorLessonId, MentorLesson>;
}