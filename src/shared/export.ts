import {MentorLessonID, TeacherID} from "./types";

interface PDFExport {
    destination: string;
    titleOverwrite?: string;
}

export interface PDFListExportParameters extends PDFExport {
    grades?: Set<string>;
    includeTitlePage?: boolean;
}

export type DaltonPhase = [number, number];

export interface PDFCheckGridExportParameters extends PDFExport{
    grades?: Set<string>;
    phasesBounds: DaltonPhase[];
    phasesNameOverwrite?: string;
    extraRowsPerStudent?: number;
    teachersFilter?: Set<TeacherID>;
    mentorLessonsFilter?: Set<MentorLessonID>;
}

export type ExportSettings =
    { type: "PDFList", parameters: PDFListExportParameters } |
    { type: "PDFCheckGrid", parameters: PDFCheckGridExportParameters };
