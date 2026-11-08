import { contextBridge, ipcRenderer } from 'electron';
import {Project, ProjectId, ProjectOverview} from "./shared/types";


contextBridge.exposeInMainWorld("electronAPI", {
    getProjects: (): Promise<ProjectOverview[]> => ipcRenderer.invoke("dialog:getProjects"),

    getProject: (projectId: ProjectId): Promise<Project> => ipcRenderer.invoke("dialog:getProjects", projectId),
    getStudents: (projectId: ProjectId): Promise<Project> => ipcRenderer.invoke("dialog:getStudents", projectId),
    getTeachers: (projectId: ProjectId): Promise<Project> => ipcRenderer.invoke("dialog:getTeachers", projectId),
    getCourses: (projectId: ProjectId): Promise<Project> => ipcRenderer.invoke("dialog:getCourses", projectId),
    getMentorLessons: (projectId: ProjectId): Promise<Project> => ipcRenderer.invoke("dialog:getMentorLessons", projectId),
});