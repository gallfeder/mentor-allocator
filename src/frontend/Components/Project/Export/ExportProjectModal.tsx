import Modal from "../../Generic/Modal/Modal";
import {Course} from "../../../../shared/types";
import "./ExportProject.css"
import {useState} from "react";
import {StateProject} from "../../../Models/States/MallocState";

interface Props {
    project: StateProject;
    onClosed: () => void;
}

const ExportProjectModal = (props: Props) => {

    type ExportType = "PDFList" | "PDFCheckGrid";
    const [exportTypeValue, setExportTypeValue] = useState<ExportType>("PDFList");

    const [exportDestinationPath, setExportDestinationPath] = useState<string>("");

    /* Only for PDFList */
    const [titleOverride, setTitleOverride] = useState<string>("");
    const [includeTitlePage, setIncludeTitlePage] = useState<boolean>(true);

    const grades: Set<string> = new Set<string>(props.project.courses.values().map((course: Course) => course.grade));
    const [restrictedGradesExport, setRestrictedGradesExport] = useState<Set<string>>(grades);

    async function chooseDestinationPath() {
        const destinationPath: string | undefined = await window.electronAPI.getDirectoryPathFromUser("Project export destination");
        if (!destinationPath) {
            return;
        }

        setExportDestinationPath(destinationPath);
    }

    function canExportProject(): boolean {
        if (exportTypeValue === "PDFList") {
            return exportDestinationPath.trim().length > 0;
        } else if (exportTypeValue === "PDFCheckGrid") {
            return exportDestinationPath.trim().length > 0;
        }

        return false;
    }

    function exportPdfList() {
        window.electronAPI.exportProject(props.project.id, {
            type: "PDFList", parameters: {
                destination: exportDestinationPath,
                titleOverwrite: titleOverride.trim().length > 0 ? titleOverride : undefined,
                includeTitlePage: includeTitlePage,
                grades: restrictedGradesExport.size > 0 ? restrictedGradesExport : undefined
            }
        }).then()
    }

    function exportProject() {
        if (exportTypeValue === "PDFList") {
            exportPdfList();
        }
    }

    return (
        <Modal onClosed={props.onClosed} modalSize="modal-medium"
               header={
                   <h2>Export project</h2>
               }
               footer={
                   <div className="export-project-footer-actions">
                       <button onClick={exportProject} disabled={!canExportProject()} className="button primary">Export</button>
                       <button onClick={props.onClosed} className="button normal">Cancel</button>
                   </div>
               }
        >
            <div className="export-project-modal">
                <div className="export-option">
                    <p>Destination<span className="required-field">*</span></p>
                    <div className="export-option-nested">
                        <button onClick={chooseDestinationPath} className="button normal">Choose destination</button>
                        <p className="hint">{exportDestinationPath.trim().length > 0 ? exportDestinationPath : "No path chosen"}</p>
                    </div>
                </div>

                <div className="export-option">
                    <p>Export type<span className="required-field">*</span></p>
                    <select value={exportTypeValue} onChange={(e) => setExportTypeValue(e.currentTarget.value as ExportType)}>
                        <option id="PDFList" value="PDFList">Students list (pdf)</option>
                        <option id="PDFCheckGrid" value="PDFCheckGrid">Mentor lesson grid (pdf)</option>
                    </select>
                </div>

                <div className="export-option">
                    <p>Title override</p>
                    <input value={titleOverride} onChange={(e) => setTitleOverride(e.currentTarget.value)}
                           type="text" placeholder="Phase"/>
                </div>

                {
                    exportTypeValue === "PDFList" ? (
                        <>
                            <hr className="line"/>
                            <div className="export-option">
                                <p>Only export grades</p>
                                <select multiple size={1} value={Array.from(restrictedGradesExport)} onChange={(e) => {
                                    const values: Set<string> = new Set<string>(Array.from(e.target.selectedOptions, (option) => option.value));
                                    setRestrictedGradesExport(values);
                                }}>
                                    {Array.from(grades.values()).map((grade: string) => {
                                        return <option key={grade} id={grade} value={grade}>{grade}</option>
                                    })}
                                </select>
                            </div>
                            <div className="export-option">
                                <p>Include title page</p>
                                <input type="checkbox" checked={includeTitlePage}
                                       onChange={(e) => setIncludeTitlePage(e.currentTarget.checked)}/>
                            </div>
                        </>
                    ) : exportTypeValue === "PDFCheckGrid" ? (
                        <>
                            <hr className="line"/>
                        </>
                    ) : null
                }
            </div>
        </Modal>
    )

}

export default ExportProjectModal;