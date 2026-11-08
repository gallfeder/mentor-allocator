
export type ProjectID = string;

export type StudentID = number;
export type TeacherID = number;
export type MentorLessonID = number;
export type CourseID = number;


export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 -> Monday, 6 -> Sunday

export type ProjectOverview = {
    id: ProjectID;
    name: string;
    students: number;
    unallocatedStudents: number;
    teachers: number;
    courses: number;
    mentorLessons: number;
    lastEdit: Date;
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
    mentorLesson: MentorLessonID;
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
    teacher: TeacherID;
    grade: string;
}

