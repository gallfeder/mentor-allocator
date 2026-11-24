import {ExportSettings} from "../../../shared/export";
import {Project} from "../../../shared/types";
import {exportPDFList} from "./pdf_list";
import {exportPDFCheckGrid} from "./pdf_check_grid";

export const exportData = async (project: Project, settings: ExportSettings): Promise<boolean> => {

    switch (settings.type) {
        case "PDFList":
            return exportPDFList(project, settings.parameters);
        case "PDFCheckGrid":
            return exportPDFCheckGrid(project, settings.parameters);
        default:
            console.log("Could not decode import settings!");
            return false;
    }
}