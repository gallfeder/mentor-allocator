
export interface UntisImportParameters {
    pathToGPU001: string;
    pathToGPU015: string;
}

export type ImportSettings =
    { type: "Untis", parameters: UntisImportParameters };
