import {
    Course,
    Day, MentorLesson,
    MentorLessonID,
    Project,
    ProjectID,
    ProjectOverview,
    Student,
    StudentID, Teacher,
    TeacherID
} from "../../../shared/types";

export default interface Database {
    createProject: (identifier: ProjectID, name: string) => Promise<void>;
    createStudent: (project: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID>;
    createTeacher: (project: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID>;
    createMentorLesson: (project: ProjectID, day: Day, lesson: number, teacher: TeacherID) => Promise<MentorLessonID>;

    allocateStudent: (project: ProjectID, lesson: MentorLessonID, student: StudentID) => Promise<void>;

    getProjects: () => Promise<ProjectOverview[]>;
    getProject: (id: ProjectID) => Promise<Project>;
    getStudents: (project: ProjectID) => Promise<Student[]>;
    getTeachers: (project: ProjectID) => Promise<Teacher[]>;
    getCourses: (project: ProjectID) => Promise<Course[]>;
    getMentorLessons: (project: ProjectID) => Promise<MentorLesson[]>;
}