interface PDFExport {
    destination: string;
}

export interface PDFListExportParameters extends PDFExport {
    grades?: Set<string>;
    includeTitlePage?: boolean;
    titleOverwrite?: string;
}

export type DaltonPhase = [number, number];

export interface PDFCheckGridExportParameters extends PDFExport{
    grades?: Set<string>;
    phasesBounds: DaltonPhase[];
}

export type ExportSettings =
    { type: "PDFList", parameters: PDFListExportParameters } |
    { type: "PDFCheckGrid", parameters: PDFCheckGridExportParameters };
