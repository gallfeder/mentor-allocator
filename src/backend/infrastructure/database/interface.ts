import {
    Course,
    CourseID,
    Day,
    MentorLesson,
    MentorLessonID,
    Project,
    ProjectID,
    ProjectOverview,
    Student,
    StudentID,
    Teacher,
    TeacherID
} from "../../../shared/types";

export default interface Database {
    createProject: (identifier: ProjectID, name: string) => Promise<void>;
    createStudent: (project: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID>;
    createTeacher: (project: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID>;
    createMentorLesson: (project: ProjectID, day: Day, lesson: number, teacher: TeacherID) => Promise<MentorLessonID>;
    createCourse: (project: ProjectID, teacher: TeacherID, grade: string, name: string) => Promise<CourseID>;

    allocateStudent: (project: ProjectID, lesson: MentorLessonID, student: StudentID) => Promise<void>;
    allocateStudents: (project: ProjectID, lesson: MentorLessonID, students: StudentID[]) => Promise<void>;

    getProjects: () => Promise<ProjectOverview[]>;
    getProject: (id: ProjectID) => Promise<Project>;
    getStudents: (project: ProjectID) => Promise<Student[]>;
    getTeachers: (project: ProjectID) => Promise<Teacher[]>;
    getCourses: (project: ProjectID) => Promise<Course[]>;
    getMentorLessons: (project: ProjectID) => Promise<MentorLesson[]>;

    editProjectName: (project: ProjectID, name: string) => Promise<void | undefined>;

    editStudent: (project: ProjectID, student: StudentID, name?: string, surname?: string, grade?: string) => Promise<Student | undefined>;
    editTeacher: (project: ProjectID, teacher: TeacherID, surname?: string, name?: string, shorthand?: string) => Promise<Teacher | undefined>;
    editMentorLesson: (project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID) => Promise<MentorLesson | undefined>;
    editCourse: (project: ProjectID, course: CourseID, teacher?: TeacherID, grade?: string, name?: string) => Promise<Course | undefined>;
}