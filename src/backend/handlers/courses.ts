import {Course, CourseID, ProjectID, TeacherID} from "../../shared/types";
import {createCourseInProject, editCourseInProject, getCoursesOfProject} from "../application/projects";
import {IpcMainInvokeEvent} from "electron";

export const getCoursesHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<Course[]> => {
    if (project == "") {
        return [];
    }
    return getCoursesOfProject(project);
}

export const createCourseHandler = async (_event: IpcMainInvokeEvent, projectID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID> => {
    return createCourseInProject(projectID, teacherID, grade, name);
}

export const editCourseHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, course: CourseID, teacher?: TeacherID, grade?: string, name?: string): Promise<Course | undefined> => {
    return editCourseInProject(project, course, teacher, grade, name);
}
