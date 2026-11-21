
export interface PDFListExportParameters {
    destination: string;
    grades?: Set<string>;
    titleOverwrite?: string;
    includeTitlePage?: boolean;
}

export type ExportSettings =
    { type: "PDFList", parameters: PDFListExportParameters };
