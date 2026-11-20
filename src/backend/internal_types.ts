import {Course, MentorLesson, MentorLessonID, Student, StudentID, Teacher} from "../shared/types";

export interface ImportedData {
    students: Student[];
    teacher: Teacher[];
    courses: Course[];
    mentorLessons: MentorLesson[];
}

export interface StudentAllocation {
    student: StudentID
    allocation: MentorLessonID
}

