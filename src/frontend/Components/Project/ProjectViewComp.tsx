import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import { Project, ProjectId } from "../../../shared/types";

import ProjectGradesSidebarComp from "./Sidebar/Grades/ProjectGradesSidebarComp";
import ProjectComp from "./ProjectComp";
import ProjectUnallocatedSidebarComp from "./Sidebar/ProjectUnallocatedSidebarComp";

import "./Project.css";
import {useMallocDispatch, useMallocState} from "../../Models/States/Hooks";
import {MallocState, StateProject} from "../../Models/States/MallocState";

const ProjectViewComp = () => {

    const mallocState: MallocState = useMallocState();
    const mallocDispatch = useMallocDispatch();
    const { projectId, grade } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {

        if (!grade) {
            const stateProject: StateProject | undefined = mallocState.projects.get(projectId as ProjectId);
            if (!stateProject) return;

            let grades: string[] = [];
            for (const student of Array.from(stateProject.students.values())) {
                if (!grades.includes(student.grade)) {
                    grades.push(student.grade);
                }
            }
            grades = grades.sort((a: string, b: string) => a.localeCompare(b));

            if (grades.length > 0) {
                navigate(`/projects/${projectId}/grade/${grades[0]}`);
            }
        }
        
    }, [grade, mallocState, navigate, projectId])

    useEffect(() => {
        
        window.electronAPI.getProject(projectId as ProjectId)
            .then((project: Project | undefined) => {
                if (!project) {
                    navigate("/");
                    return;
                }

                mallocDispatch!({ type: "INIT_PROJECT", payload: { project } });
            });
        
    }, [mallocDispatch, navigate, projectId]);

    return (
        <div className="project-view-comp">
            <ProjectGradesSidebarComp/>
            <ProjectComp/>
            <ProjectUnallocatedSidebarComp/>
        </div>
    )

}

export default ProjectViewComp;