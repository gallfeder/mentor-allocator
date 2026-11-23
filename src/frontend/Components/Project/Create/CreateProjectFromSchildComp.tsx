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
                <div className="required-field">
                    <h3>Project name</h3>
                    <p>*</p>
                </div>
                <input value={projectName} onChange={(e) => setProjectName(e.currentTarget.value)}
                       className="input" type="text" placeholder="Project name"/>
            </div>

            <div className="form-row import-option">
                <div className="required-field">
                    <h3>Students grade</h3>
                    <p>*</p>
                </div>
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
                <div className="required-field">
                    <h3>Courses</h3>
                    <p>*</p>
                </div>
                <button onClick={getSchILDCoursesPath} className="button normal">Open file</button>
                <p>{schildCoursesPath.length === 0 ? "" : `(${schildCoursesPath})`}</p>
            </div>

            <div className="form-row path-import">
                <div className="required-field">
                    <h3>Student courses</h3>
                    <p>*</p>
                </div>
                <button onClick={getSchILDStudentCoursesPath} className="button normal">Open file</button>
                <p>{schildStudentCoursesPath.length === 0 ? "" : `(${schildStudentCoursesPath})`}</p>
            </div>
        </div>
    )

}

export default CreateProjectFromSchildComp;