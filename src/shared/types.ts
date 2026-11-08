
export type ProjectID = string;
export type ProjectId = ProjectID;

export type StudentID = number;
export type StudentId = StudentID;

export type TeacherID = number;
export type TeacherId = TeacherID;

export type MentorLessonID = number;
export type MentorLessonId = MentorLessonID;

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 -> Monday, 6 -> Sunday

export type ProjectOverview = {
    id: ProjectID;
    name: string;
}

export interface Project {
    id: ProjectID;
    name: string;
    dataVersion: number;
    students: Student[];
    courses: Course[];
    teachers: Teacher[];
    mentorLessons: MentorLesson[];
}

export interface Student {
    id: StudentID;
    name: string;
    surname: string;
    grade: string;
    mentorLesson: MentorLessonID;
}

export interface Course {
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

