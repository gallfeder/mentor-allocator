
export type ProjectID = string;

export type StudentID = number;
export type TeacherID = number;
export type MentorLessonID = number;

export type Days = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 -> Monday, 6 -> Sunday

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

interface Student {
    id: StudentID;
    name: string;
    surname: string;
    grade: string;
    mentorLesson: MentorLessonID;
}

interface Course {
    grade: string;
    name: string;
    teacher: TeacherID;
    students: StudentID[];
}

interface Teacher {
    id: TeacherID;
    shorthand: string;
    name: string;
    surname: string;
}

interface MentorLesson {
    id: MentorLessonID;
    day: Days;
    lesson: number;
    teacher: TeacherID;
    grade: string;
}

