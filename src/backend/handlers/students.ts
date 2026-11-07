import {ProjectID, Student} from "../../shared/types";
import {getStudentsOfProject} from "../application/projects";
import IpcMainEvent = Electron.IpcMainEvent;
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectStudentsHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Student[]> => {
    if (project == "") {
        return [];
    }
    return getStudentsOfProject(project);
}