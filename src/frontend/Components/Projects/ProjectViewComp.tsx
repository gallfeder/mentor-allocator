import { useEffect } from "react";
import {useMallocDispatch, useMallocState} from "../../Models/States/Hooks";
import {MallocState, StateProject} from "../../Models/States/MallocState";
import {ProjectOverview} from "../../../shared/types";
import ProjectCardComp from "./ProjectCardComp";
import "./Projects.css";
import CreateProjectComp from "./CreateProjectComp";

const ProjectViewComp = () => {

    const mallocState: MallocState = useMallocState();
    const mallocDispatch = useMallocDispatch();

    useEffect(() => {
        window.electronAPI.getProjects()
            .then((projects: ProjectOverview[]) => {
                if (mallocDispatch) {
                    mallocDispatch({
                        type: "INIT_PROJECTS", payload: projects.map((overview: ProjectOverview) => {
                            return { projectId: overview.id, projectName: overview.name };
                        })
                    })
                }
            })
            .catch(console.error);
    }, [mallocDispatch])

    return (
        <div className="project-view">
            <h2>Projects</h2>
            <div className="projects">
                { Array.from(mallocState.projects.values()).map((project: StateProject) => {
                    return <ProjectCardComp key={project.id} projectId={project.id}/>
                }) }
            </div>
            <CreateProjectComp/>
        </div>
    )

}

export default ProjectViewComp;