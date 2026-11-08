import {Project, ProjectID, ProjectOverview} from "../../shared/types";
import {createProject, editProjectName, getAllProjects, getProject} from "../application/projects";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectsHandler = (): Promise<ProjectOverview[]> => {
    return getAllProjects();
}

export const getProjectHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Project> => {
    if (project == "") {
        return {
            id: project,
            dataVersion: -1,
            name: "Invalid Project ID!",
            courses: [],
            mentorLessons: [],
            students: [],
            teachers: []
        }
    }
    return getProject(project);
}

export const createProjectHandler = async (_event: IpcMainInvokeEvent, name: string): Promise<ProjectID> => {
    return createProject(name)
}

export const editProjectNameHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, name: string): Promise<void | undefined> => {
    return editProjectName(project, name);
}
