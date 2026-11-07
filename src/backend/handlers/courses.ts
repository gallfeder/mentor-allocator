import {Course, ProjectID} from "../../shared/types";
import IpcMainEvent = Electron.IpcMainEvent;
import {getCoursesOfProject} from "../application/projects";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectCoursesHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Course[]> => {
    if (project == "") {
        return [];
    }
    return getCoursesOfProject(project);
}
