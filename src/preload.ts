import contextBridge = Electron.contextBridge;
import {Project, ProjectID, ProjectOverview} from "./shared/types";
import ipcRenderer = Electron.ipcRenderer;


contextBridge.exposeInMainWorld("electronAPI", {
    getProjects: (): Promise<ProjectOverview[]> => ipcRenderer.invoke("dialog:getProjects"),

    getProject: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getProjects", project),
    getStudents: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getStudents", project),
    getTeachers: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getTeachers", project),
    getCourses: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getCourses", project),
    getMentorLessons: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getMentorLessons", project),
});