import {MentorLessonID, TeacherID} from "./types";

interface PDFExport {
    destination: string;
    titleOverwrite?: string;
    grades?: Set<string>;
}

export interface PDFListExportParameters extends PDFExport {
    includeTitlePage?: boolean;
}

export type DaltonPhase = [number, number];

export interface PDFCheckGridExportParameters extends PDFExport{
    phasesBounds: DaltonPhase[];
    phasesNameOverwrite?: string;
    extraRowsPerStudent?: number;
    teachersFilter?: Set<TeacherID>;
    mentorLessonsFilter?: Set<MentorLessonID>;
    mergeExtraRows?: boolean;
}

export type ExportSettings =
    { type: "PDFList", parameters: PDFListExportParameters } |
    { type: "PDFCheckGrid", parameters: PDFCheckGridExportParameters };
