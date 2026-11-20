import {Project, ProjectID, ProjectOverview} from "../../shared/types";
import {
    createProject,
    deleteProject,
    editProjectName,
    getAllProjects,
    getProject
} from "../application/projects";
import {IpcMainInvokeEvent} from "electron";
import {ImportSettings} from "../../shared/import";

export const getProjectsHandler = (): Promise<ProjectOverview[]> => {
    return getAllProjects();
}

export const getProjectHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Project | undefined> => {
    if (project.length == 0) {
        return undefined
    }
    return getProject(project);
}

export const createProjectHandler = async (_event: IpcMainInvokeEvent, name: string, importSettings?: ImportSettings): Promise<ProjectID | undefined> => {
    return createProject(name, importSettings)
}

export const editProjectNameHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, name: string): Promise<boolean> => {
    return editProjectName(project, name);
}

export const deleteProjectHandler = (_event: IpcMainInvokeEvent, project: ProjectID): Promise<boolean> => {
    return deleteProject(project);
}
