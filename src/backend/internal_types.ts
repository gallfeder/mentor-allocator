import {Course, MentorLesson, Student, Teacher} from "../shared/types";

export interface ImportedData {
    students: Student[];
    teacher: Teacher[];
    courses: Course[];
    mentorLessons: MentorLesson[];
}
