
export type ProjectID = string;
export type ProjectId = ProjectID;

export type StudentID = number;
export type StudentId = StudentID;

export type TeacherID = number;
export type TeacherId = TeacherID;

export type MentorLessonID = number;
export type MentorLessonId = MentorLessonID;

export type CourseID = number;
export type CourseId = CourseID;

export enum Day {
    Unspecified = -1,
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
    Saturday = 5,
    Sunday = 6
}

export type ProjectOverview = {
    id: ProjectID;
    name: string;
    studentsCount: number;
    unallocatedStudentsCount: number;
    teachersCount: number;
    coursesCount: number;
    mentorLessonsCount: number;
    lastEditDate: Date;
}

export interface Project {
    id: ProjectID;
    name: string;
    dataVersion: number;
    students: Student[];
    courses: Course[];
    teachers: Teacher[];
    mentorLessons: MentorLesson[];
    lastEdit: Date;
}

export interface Student {
    id: StudentID;
    name: string;
    surname: string;
    grade: string;
    mentorLessonId: MentorLessonID;
}

export interface Course {
    id: CourseID;
    grade: string;
    name: string;
    teacher: TeacherID;
    students: StudentID[];
}

export interface Teacher {
    id: TeacherID;
    shorthand: string;
    name: string;
    surname: string;
}

export interface MentorLesson {
    id: MentorLessonID;
    day: Day;
    lesson: number;
    teacherId: TeacherID;
    grade: string;
}
