import {ExportSettings} from "../../../shared/export";
import {Project} from "../../../shared/types";
import {exportPDFList} from "./pdf_list";

export const exportData = async (project: Project, settings: ExportSettings): Promise<boolean> => {

    switch (settings.type) {
        case "PDFList":
            return exportPDFList(project, settings.parameters);
        default:
            console.log("Could not decode import settings!");
            return false;
    }
}