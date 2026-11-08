import {Course, CourseID, ProjectID, TeacherID} from "../../shared/types";
import {createCourseInProject, getCoursesOfProject} from "../application/projects";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getCoursesHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Course[]> => {
    if (project == "") {
        return [];
    }
    return getCoursesOfProject(project);
}

export const createCourseHandler = async (_event: IpcMainInvokeEvent, projectID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID> => {
    return createCourseInProject(projectID, teacherID, grade, name);
}

