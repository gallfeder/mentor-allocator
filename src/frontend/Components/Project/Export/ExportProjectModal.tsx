import Modal from "../../Generic/Modal/Modal";
import {Course, MentorLesson, Teacher, TeacherId} from "../../../../shared/types";
import "./ExportProject.css"
import {useMemo, useState} from "react";
import {StateProject} from "../../../Models/States/MallocState";
import {getTeacherName} from "../../../Helpers/teacherHelpers";
import PhasesBoundComp from "./PhasesBoundComp";
import {DaltonPhase} from "../../../../shared/export";

interface Props {
    project: StateProject;
    onClosed: () => void;
}

const ExportProjectModal = (props: Props) => {

    type ExportType = "PDFList" | "PDFCheckGrid";
    const [exportTypeValue, setExportTypeValue] = useState<ExportType>("PDFCheckGrid");

    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportDestinationPath, setExportDestinationPath] = useState<string>("");

    const projectGrades: Set<string> = new Set<string>(props.project.courses.values().map((course: Course) => course.grade));
    const [restrictedGradesExport, setRestrictedGradesExport] = useState<Set<string>>(projectGrades);

    /* ---------------- */
    /* Only for PDFList */
    /* ---------------- */
    const [titleOverride, setTitleOverride] = useState<string>(props.project.name);
    const [includeTitlePage, setIncludeTitlePage] = useState<boolean>(true);

    /* --------------------- */
    /* Only for PDFCheckGrid */
    /* --------------------- */
    const [daltonPhases, setDaltonPhases] = useState<DaltonPhase[]>([[1, 10]]);
    const [phasesNameOverride, setPhasesNameOverride] = useState<string>("");
    const [extraRowsPerStudent, setExtraRowsPerStudent] = useState<number>(1);

    const teachers: Teacher[] = useMemo(() => {
        return Array.from(props.project.teachers.values().filter((teacher: Teacher) => {
            const grades: string[] = Array.from(props.project.mentorLessons.values())
                .filter((mentorLesson: MentorLesson) => mentorLesson.teacherId === teacher.id)
                .map((mentorLesson: MentorLesson) => mentorLesson.grade);
            for (const grade of grades) {
                if (restrictedGradesExport.has(grade)) {
                    return true;
                }
            }

            return false;
        }));
    }, [props, restrictedGradesExport]);
    const [teacherFilters, setTeacherFilters] = useState<TeacherId[]>(teachers.map((teacher: Teacher) => teacher.id));

    async function chooseDestinationPath() {
        const destinationPath: string | undefined = await window.electronAPI.getDirectoryPathFromUser("Project export destination");
        if (!destinationPath) {
            return;
        }

        setExportDestinationPath(destinationPath);
    }

    function canExportProject(): boolean {
        if (isExporting) {
            return false;
        }

        if (exportTypeValue === "PDFList") {
            return exportDestinationPath.trim().length > 0;
        } else if (exportTypeValue === "PDFCheckGrid") {
            return exportDestinationPath.trim().length > 0;
        }

        return false;
    }

    function exportPdfList() {
        setIsExporting(true);
        window.electronAPI.exportProject(props.project.id, {
            type: "PDFList", parameters: {
                destination: exportDestinationPath,
                titleOverwrite: titleOverride.trim().length > 0 ? titleOverride : undefined,
                includeTitlePage: includeTitlePage,
                grades: restrictedGradesExport.size > 0 ? restrictedGradesExport : undefined
            }
        }).then((succeeded: boolean) => {
            if (succeeded) {
                props.onClosed();
                return;
            }
            setIsExporting(false);
        })
    }

    function exportPfdCheckGrid() {
        setIsExporting(true);
        window.electronAPI.exportProject(props.project.id, {
            type: "PDFCheckGrid", parameters: {
                destination: exportDestinationPath,
                titleOverwrite: titleOverride.trim().length > 0 ? titleOverride : undefined,
                grades: restrictedGradesExport.size > 0 ? restrictedGradesExport : undefined,
                phasesBounds: daltonPhases.map((daltonPhase: DaltonPhase) => [daltonPhase[0] - 1, daltonPhase[1]]),
                phasesNameOverwrite: phasesNameOverride.length > 0 ? phasesNameOverride : undefined,
                extraRowsPerStudent: extraRowsPerStudent,
                teachersFilter: new Set<TeacherId>(teacherFilters),
            }
        }).then((succeeded: boolean) => {
            if (succeeded) {
                props.onClosed();
                return;
            }
            setIsExporting(false);
        })
    }

    function exportProject() {
        if (exportTypeValue === "PDFList") {
            exportPdfList();
        } else if (exportTypeValue === "PDFCheckGrid") {
            exportPfdCheckGrid();
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
                    <p>Export type<span className="required-field">*</span></p>
                    <select value={exportTypeValue} onChange={(e) => setExportTypeValue(e.currentTarget.value as ExportType)}>
                        <option id="PDFList" value="PDFList">Students list (pdf)</option>
                        <option id="PDFCheckGrid" value="PDFCheckGrid">Mentor lesson grid (pdf)</option>
                    </select>
                </div>

                <div className="export-option">
                    <p>Destination<span className="required-field">*</span></p>
                    <div className="export-option-nested">
                        <button onClick={chooseDestinationPath} className="button normal">Choose destination</button>
                        <p className="hint">{exportDestinationPath.trim().length > 0 ? exportDestinationPath : "No path chosen"}</p>
                    </div>
                </div>

                <div className="export-option">
                    <p>Project name override</p>
                    <input value={titleOverride} onChange={(e) => setTitleOverride(e.currentTarget.value)} type="text"/>
                </div>

                <div className="export-option">
                    <p>Grades filter</p>
                    <select multiple size={1} value={Array.from(restrictedGradesExport)} onChange={(e) => {
                        const values: Set<string> = new Set<string>(Array.from(e.target.selectedOptions, (option) => option.value));
                        setRestrictedGradesExport(values);
                    }}>
                        {Array.from(projectGrades.values()).map((grade: string) => {
                            return <option key={grade} id={grade} value={grade}>{grade}</option>
                        })}
                    </select>
                </div>

                {
                    exportTypeValue === "PDFList" ? (
                        <>
                            <hr className="line"/>
                            <div className="export-option">
                                <p>Include title page</p>
                                <input type="checkbox" checked={includeTitlePage}
                                       onChange={(e) => setIncludeTitlePage(e.currentTarget.checked)}/>
                            </div>
                        </>
                    ) : exportTypeValue === "PDFCheckGrid" ? (
                        <>
                            <hr className="line"/>
                            <div className="export-option start-beginning">
                                <p>Phases bounds<span className="required-field">*</span></p>
                                <PhasesBoundComp setDaltonPhases={setDaltonPhases} daltonPhases={daltonPhases}/>
                            </div>

                            <div className="export-option">
                                <p>Phases name overwrite</p>
                                <input type="text" placeholder="Phase"
                                       value={phasesNameOverride} onChange={(e) => setPhasesNameOverride(e.currentTarget.value)}/>
                            </div>

                            <div className="export-option">
                                <p>Teacher filters</p>
                                <select multiple size={1} value={teacherFilters.map((teacherId: TeacherId) => String(teacherId))}
                                        onChange={(e) => {
                                            setTeacherFilters(Array.from(e.target.selectedOptions, (option) => option.value) as unknown as TeacherId[])
                                        }}>
                                    {teachers.map((teacher: Teacher) => {
                                        return <option key={teacher.id} value={teacher.id}>{getTeacherName(teacher)}</option>
                                    })}
                                </select>
                            </div>

                            <div className="export-option">
                                <p>Extra rows per student</p>
                                <input type="number" placeholder="1" value={extraRowsPerStudent} min={0}
                                       onChange={(e) => setExtraRowsPerStudent(Number(e.currentTarget.value))}/>
                            </div>
                        </>
                    ) : null
                }
            </div>
        </Modal>
    )

}

export default ExportProjectModal;