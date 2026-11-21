
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

export type ImportType = SchILDImportType | UntisImportType;
export type SchILDImportType = "SchILD";
export type UntisImportType = "Untis";

export type ImportSettings =
    { type: UntisImportType, parameters: UntisImportParameters } |
    { type: SchILDImportType, parameters: SchILDImportParameters };
