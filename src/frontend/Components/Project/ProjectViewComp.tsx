/*
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Project, ProjectId } from "../../../shared/types";
*/

import ProjectGradesSidebarComp from "./Sidebar/ProjectGradesSidebarComp";
import ProjectComp from "./ProjectComp";
import ProjectUnallocatedSidebarComp from "./Sidebar/ProjectUnallocatedSidebarComp";

import "./Project.css";

const ProjectViewComp = () => {
    /*
    const { projectId, grade } = useParams();

    useEffect(() => {

        window.electronAPI.getProject(projectId as ProjectId)
            .then((project: Project) => {

            })

    }, [projectId])
*/

    return (
        <div className="project-view-comp">
            <ProjectGradesSidebarComp/>
            <ProjectComp/>
            <ProjectUnallocatedSidebarComp/>
        </div>
    )

}

export default ProjectViewComp;