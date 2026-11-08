import {ProjectID, Teacher, TeacherID} from "../../shared/types";
import {createTeacherInProject, getTeachersOfProject} from "../application/projects";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectTeachersHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Teacher[]> => {
    if (project == "") {
        return [];
    }
    return getTeachersOfProject(project);
}

export const createTeacherHandler = async (_event: IpcMainInvokeEvent, prID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID> => {
    return createTeacherInProject(prID, surname, name, shorthand);
}

