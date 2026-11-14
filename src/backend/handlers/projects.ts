import {Project, ProjectID, ProjectOverview} from "../../shared/types";
import {
    createProject,
    createProjectWithUntisImport,
    deleteProject,
    editProjectName,
    getAllProjects,
    getProject
} from "../application/projects";
import {IpcMainInvokeEvent} from "electron";

export const getProjectsHandler = (): Promise<ProjectOverview[]> => {
    return getAllProjects();
}

export const getProjectHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Project | undefined> => {
    if (project.length == 0) {
        return undefined
    }
    return getProject(project);
}

export const createProjectHandler = async (_event: IpcMainInvokeEvent, name: string): Promise<ProjectID | undefined> => {
    return createProject(name)
}

export const editProjectNameHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, name: string): Promise<boolean> => {
    return editProjectName(project, name);
}

export const createProjectFromUntisHandler = async (_event: IpcMainInvokeEvent, name: string, pathGPU001: string, pathGPU015: string): Promise<ProjectID | undefined> => {
    return createProjectWithUntisImport(name, pathGPU001, pathGPU015);
}

export const deleteProjectHandler = (_event: IpcMainInvokeEvent, project: ProjectID): Promise<boolean> => {
    return deleteProject(project);
}
