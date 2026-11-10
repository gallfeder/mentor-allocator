import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect} from "react";
import { Project, ProjectId } from "../../../shared/types";

import ProjectGradesSidebarComp from "./Sidebar/Grades/ProjectGradesSidebarComp";
import ProjectComp from "./ProjectComp";
import ProjectUnallocatedSidebarComp from "./Sidebar/ProjectUnallocatedSidebarComp";

import "./Project.css";
import {useMallocDispatch, useMallocState} from "../../Models/States/Hooks";
import {StateProject} from "../../Models/States/MallocState";

const ProjectViewComp = () => {

    const mallocState = useMallocState();
    const mallocDispatch = useMallocDispatch();
    const { projectId, grade } = useParams();
    const navigate = useNavigate();

    const navigateToFirstGrade = useCallback(() => {
        const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
        if (!stateProject) {
            return;
        }

        let grades: string[] = [];
        for (const student of Array.from(stateProject.students.values())) {
            if (!grades.includes(student.grade)) {
                grades.push(student.grade);
            }
        }
        grades = grades.sort((a: string, b: string) => a.localeCompare(b));

        navigate(`/projects/${projectId}/grade/${grades[0]}`);
    }, [mallocState, navigate, projectId])

    useEffect(() => {

        window.electronAPI.getProject(projectId as ProjectId)
            .then((project: Project) => {
                if (mallocDispatch) {
                    mallocDispatch({type: "INIT_PROJECT", payload: { project: project }});

                    if (!grade) {
                        navigateToFirstGrade();
                    }
                }
            })

    }, [grade, mallocDispatch, navigateToFirstGrade, projectId])

    return (
        <div className="project-view-comp">
            <ProjectGradesSidebarComp/>
            <ProjectComp/>
            <ProjectUnallocatedSidebarComp/>
        </div>
    )

}

export default ProjectViewComp;