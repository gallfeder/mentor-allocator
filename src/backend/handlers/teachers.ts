import {ProjectID, Student, Teacher} from "../../shared/types";
import {getStudentsOfProject, getTeachersOfProject} from "../application/projects";
import IpcMainEvent = Electron.IpcMainEvent;
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectTeachersHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Teacher[]> => {
    if (project == "") {
        return [];
    }
    return getTeachersOfProject(project);
}