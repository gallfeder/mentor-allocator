import {ProjectID, Student, StudentID} from "../../shared/types";
import {createStudentInProject, editStudentInProject, getStudentsOfProject} from "../application/projects";
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

export const editStudentHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, student: StudentID, name?: string, surname?: string, grade?: string): Promise<Student | undefined> => {
    return editStudentInProject(project, student, name, surname, grade);
}
