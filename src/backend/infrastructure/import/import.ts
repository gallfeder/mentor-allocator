import {ImportSettings} from "../../../shared/import";
import {importFromUntisFiles} from "./untis";
import {ImportedData} from "../../internal_types";

export const getDataFromImport = async (settings: ImportSettings): Promise<ImportedData | undefined> => {

    switch (settings.type) {
        case "Untis":
            return importFromUntisFiles(settings.parameters.pathToGPU001, settings.parameters.pathToGPU015);
        default:
            console.log("Could not decode import settings!");
            return undefined;
    }
}