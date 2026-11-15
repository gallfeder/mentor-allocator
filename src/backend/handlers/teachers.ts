import {ProjectID, Teacher, TeacherID} from "../../shared/types";
import {
    createTeacherInProject,
    deleteTeacher,
    editTeacherInProject,
    getTeachersOfProject
} from "../application/projects";
import {IpcMainInvokeEvent} from "electron";

export const getProjectTeachersHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Teacher[]> => {
    if (project == "") {
        return [];
    }
    return getTeachersOfProject(project);
}

export const createTeacherHandler = async (_event: IpcMainInvokeEvent, prID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID | undefined> => {
    return createTeacherInProject(prID, surname, name, shorthand);
}

export const editTeacherHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, teacher: TeacherID, surname?: string, name?: string, shorthand?: string): Promise<Teacher | undefined> => {
    return editTeacherInProject(project, teacher, surname, name, shorthand);
}

export const deleteTeacherHandler = (_event: IpcMainInvokeEvent, project: ProjectID, id: TeacherID): Promise<boolean> => {
    return deleteTeacher(project, id);
}

