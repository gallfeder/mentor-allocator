import {ProjectID, Student, StudentID} from "../../shared/types";
import {createStudentInProject, getStudentsOfProject} from "../application/projects";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectStudentsHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Student[]> => {
    if (project == "") {
        return [];
    }
    return getStudentsOfProject(project);
}

export const createStudentHandler = async (_event: IpcMainInvokeEvent, prID: ProjectID, name: string, surname: string, grade: string): Promise<StudentID> => {
    return createStudentInProject(prID, name, surname, grade);
}
