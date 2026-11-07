

export type ProjectID = string;

export type StudentID = number;
export type TeacherID = number;
export type MentorLessonID = number;

export type Days = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 -> Monday, 6 -> Sunday

export type ProjectOverview = {
    id: ProjectID;
    name: string;
}
