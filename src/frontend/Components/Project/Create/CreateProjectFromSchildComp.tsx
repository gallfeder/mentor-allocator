import {Ref, useImperativeHandle, useState} from "react";
import {ProjectId} from "../../../../shared/types";
import {ImportProjectHandle} from "./CreateProjectModalComp";

interface Props {
    ref: Ref<ImportProjectHandle>
    onCreated: (projectId: ProjectId | undefined) => void;
}

const CreateProjectFromSchildComp = (props: Props) => {

    const [projectName, setProjectName] = useState<string>("");
    const [grade, setGrade] = useState<string>("");

    const [coursesSeparator, setCoursesSeparator] = useState<string>("");
    const [studentCoursesSeparator, setStudentCoursesSeparator] = useState<string>("");

    const [schildCoursesPath, setSchildCoursesPath] = useState<string>("");
    const [schildStudentCoursesPath, setSchildStudentCoursesPath] = useState<string>("");

    function createProject(): void {
        window.electronAPI.createProject(projectName, {
            type: "SchILD", parameters: {
                pathToCourses: schildCoursesPath,
                pathToStudentCourses: schildStudentCoursesPath,
                studentsGrade: grade,
                coursesSeparatorOverwrite : coursesSeparator.length === 0 ? undefined : coursesSeparator,
                studentCoursesSeparatorOverwrite: studentCoursesSeparator.length === 0 ? undefined : studentCoursesSeparator,
            }
        }).then((projectId: ProjectId | undefined) => {
            props.onCreated(projectId);
        });
    }

    // eslint-disable-next-line react-hooks/refs
    useImperativeHandle(props.ref, () => ({
        createProject
    }));

    async function getSchILDCoursesPath() {
        const path: string | undefined = await window.electronAPI.getFilePathFromUser("SchILD Courses");
        if (!path) {
            return;
        }

        setSchildCoursesPath(path);
    }

    async function getSchILDStudentCoursesPath() {
        const path: string | undefined = await window.electronAPI.getFilePathFromUser("SchILD Student Courses");
        if (!path) {
            return;
        }

        setSchildStudentCoursesPath(path);
    }

    return (
        <div className="schild-import-type">
            <div className="import-option">
                <h3>Project name</h3>
                <input value={projectName} onChange={(e) => setProjectName(e.currentTarget.value)}
                       className="input" type="text"/>
            </div>

            <div className="import-option">
                <h3>Students grade</h3>
                <input value={grade} onChange={(e) => setGrade(e.currentTarget.value)} className="input" type="text"/>
            </div>

            <div className="import-option">
                <h3>Separators</h3>
                <input value={coursesSeparator} onChange={(e) => setCoursesSeparator(e.currentTarget.value)}
                       className="input" type="text" placeholder="Courses separator"/>
                <input value={studentCoursesSeparator} onChange={(e) => setStudentCoursesSeparator(e.currentTarget.value)}
                       className="input" type="text" placeholder="Student course separator"/>
            </div>

            <br/>

            <div className="path-import">
                <h3>Courses</h3>
                <button onClick={getSchILDCoursesPath} className="button normal">Open file</button>
                <p>{schildCoursesPath.length === 0 ? "" : `(${schildCoursesPath})`}</p>
            </div>

            <div className="path-import">
                <h3>Student courses</h3>
                <button onClick={getSchILDStudentCoursesPath} className="button normal">Open file</button>
                <p>{schildStudentCoursesPath.length === 0 ? "" : `(${schildStudentCoursesPath})`}</p>
            </div>
        </div>
    )

}

export default CreateProjectFromSchildComp;