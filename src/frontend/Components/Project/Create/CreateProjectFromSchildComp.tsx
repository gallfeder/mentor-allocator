import {useEffect, useImperativeHandle, useState} from "react";
import {ProjectId} from "../../../../shared/types";
import {CreateProjectCompProps} from "./CreateProjectModalComp";

const CreateProjectFromSchildComp = ({ setCanCreateProject, projectName, setProjectName, onCreated, ref }: CreateProjectCompProps) => {

    const [grade, setGrade] = useState<string>("");

    const [coursesSeparator, setCoursesSeparator] = useState<string>("");
    const [studentCoursesSeparator, setStudentCoursesSeparator] = useState<string>("");

    const [schildCoursesPath, setSchildCoursesPath] = useState<string>("");
    const [schildStudentCoursesPath, setSchildStudentCoursesPath] = useState<string>("");

    function createProject() {
        window.electronAPI.createProject(projectName, {
            type: "SchILD", parameters: {
                pathToCourses: schildCoursesPath,
                pathToStudentCourses: schildStudentCoursesPath,
                studentsGrade: grade,
                coursesSeparatorOverwrite : coursesSeparator.length === 0 ? undefined : coursesSeparator,
                studentCoursesSeparatorOverwrite: studentCoursesSeparator.length === 0 ? undefined : studentCoursesSeparator,
            }
        }).then((projectId: ProjectId | undefined) => {
            onCreated(projectId);
        });
    }

    useEffect(() => {
        setCanCreateProject(projectName.trim().length > 0 && grade.trim().length > 0 && schildCoursesPath.length > 0 && schildStudentCoursesPath.length > 0);
    }, [grade, projectName, schildCoursesPath, schildStudentCoursesPath, setCanCreateProject]);

    useImperativeHandle(ref, () => ({
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
            <div className="form-row import-option">
                <h3>Project name<span className="required-field">*</span></h3>
                <input value={projectName} onChange={(e) => setProjectName(e.currentTarget.value)}
                       className="input" type="text" placeholder="Project name"/>
            </div>

            <div className="form-row import-option">
                <h3>Students grade<span className="required-field">*</span></h3>
                <input value={grade} onChange={(e) => setGrade(e.currentTarget.value)}
                       className="input" type="text" placeholder="Students grade"/>
            </div>

            <div className="form-row import-option import-separators">
                <h3>Separators</h3>
                <input value={coursesSeparator} onChange={(e) => setCoursesSeparator(e.currentTarget.value)}
                       className="input" type="text" placeholder="Courses separator (|)"/>
                <input value={studentCoursesSeparator} onChange={(e) => setStudentCoursesSeparator(e.currentTarget.value)}
                       className="input" type="text" placeholder="Student course separator (;)"/>
            </div>

            <br/>

            <div className="form-row path-import">
                <h3>Courses<span className="required-field">*</span></h3>
                <button onClick={getSchILDCoursesPath} className="button normal">Open file</button>
                <p>{schildCoursesPath.length === 0 ? "" : `(${schildCoursesPath})`}</p>
            </div>

            <div className="form-row path-import">
                <h3>Student courses<span className="required-field">*</span></h3>
                <button onClick={getSchILDStudentCoursesPath} className="button normal">Open file</button>
                <p>{schildStudentCoursesPath.length === 0 ? "" : `(${schildStudentCoursesPath})`}</p>
            </div>
        </div>
    )

}

export default CreateProjectFromSchildComp;