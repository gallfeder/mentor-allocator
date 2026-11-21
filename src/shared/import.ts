
export interface UntisImportParameters {
    pathToGPU001: string;
    pathToGPU015: string;
}

export interface SchILDImportParameters {
    pathToCourses: string;
    pathToStudentCourses: string;
    studentsGrade: string;
    coursesSeparatorOverwrite?: string;
    studentCoursesSeparatorOverwrite?: string;
}

export type ImportSettings =
    { type: "Untis", parameters: UntisImportParameters } |
    { type: "SchILD", parameters: SchILDImportParameters };
