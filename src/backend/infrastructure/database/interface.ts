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
    createProject: (identifier: ProjectID, name: string) => Promise<boolean>;
    createStudent: (project: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID | undefined>;
    createTeacher: (project: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID | undefined>;
    createMentorLesson: (project: ProjectID, day: Day, lesson: number, teacher: TeacherID) => Promise<MentorLessonID | undefined>;
    createCourse: (project: ProjectID, teacher: TeacherID, grade: string, name: string) => Promise<CourseID | undefined>;

    allocateStudent: (project: ProjectID, lesson: MentorLessonID, student: StudentID) => Promise<boolean>;
    allocateStudents: (project: ProjectID, lesson: MentorLessonID, students: StudentID[]) => Promise<boolean>;

    getProjects: () => Promise<ProjectOverview[]>;
    getProject: (id: ProjectID) => Promise<Project | undefined>;
    getStudents: (project: ProjectID) => Promise<Student[]>;
    getTeachers: (project: ProjectID) => Promise<Teacher[]>;
    getCourses: (project: ProjectID) => Promise<Course[]>;
    getMentorLessons: (project: ProjectID) => Promise<MentorLesson[]>;

    editProjectName: (project: ProjectID, name: string) => Promise<boolean>;

    editStudent: (project: ProjectID, student: StudentID, name?: string, surname?: string, grade?: string) => Promise<Student | undefined>;
    editTeacher: (project: ProjectID, teacher: TeacherID, surname?: string, name?: string, shorthand?: string) => Promise<Teacher | undefined>;
    editMentorLesson: (project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID) => Promise<MentorLesson | undefined>;
    editCourse: (project: ProjectID, course: CourseID, teacher?: TeacherID, grade?: string, name?: string) => Promise<Course | undefined>;

    setStudents: (project: ProjectID, students: Student[]) => Promise<boolean>;
    setTeachers: (project: ProjectID, teachers: Teacher[]) => Promise<boolean>;
    setCourses: (project: ProjectID, courses: Course[]) => Promise<boolean>;
    setMentorLessons: (project: ProjectID, mentorLessons: MentorLesson[]) => Promise<boolean>;

    deleteProject: (project: ProjectID) => Promise<boolean>;
    deleteStudent: (project: ProjectID, student: StudentID) => Promise<boolean>;
    deleteTeacher: (project: ProjectID, teacher: TeacherID) => Promise<boolean>;
    deleteCourse: (project: ProjectID, course: CourseID) => Promise<boolean>;
    deleteMentorLesson: (project: ProjectID, mentorLesson: MentorLessonID) => Promise<boolean>;
}