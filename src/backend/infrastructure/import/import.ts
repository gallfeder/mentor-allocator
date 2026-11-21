import {ImportSettings} from "../../../shared/import";
import {importFromUntisFiles} from "./untis";
import {ImportedData} from "../../internal_types";
import {importFromSchILDFiles} from "./schild";

export const getDataFromImport = async (settings: ImportSettings): Promise<ImportedData | undefined> => {

    switch (settings.type) {
        case "Untis":
            return importFromUntisFiles(settings.parameters);
        case "SchILD":
            return importFromSchILDFiles(settings.parameters);
        default:
            console.log("Could not decode import settings!");
            return undefined;
    }
}