import {
    Course, CourseId,
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
    lastEdit: Date;
    dataVersion: number;
    students: Map<StudentId, Student>;
    courses: Map<CourseId, Course>;
    teachers: Map<TeacherId, Teacher>;
    mentorLessons: Map<MentorLessonId, MentorLesson>;
}