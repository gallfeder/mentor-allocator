import {Days, MentorLessonID, ProjectID, ProjectOverview, StudentID, TeacherID} from "../../../shared/types";

export default interface Database {
    createProject: (identifier: ProjectID, name: string) => Promise<void>;
    createStudent: (project: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID>;
    createTeacher: (project: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID>;
    createMentorLesson: (project: ProjectID, day: Days, lesson: number, teacher: TeacherID) => Promise<MentorLessonID>;

    allocateStudent: (project: ProjectID, lesson: MentorLessonID, student: StudentID) => Promise<void>;

    getProjects: () => Promise<ProjectOverview[]>;
}