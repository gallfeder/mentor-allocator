import {contextBridge, ipcRenderer} from "electron";
import {
    CourseID,
    Days,
    MentorLessonID,
    Project,
    ProjectID,
    ProjectOverview,
    StudentID,
    TeacherID
} from "./shared/types";


contextBridge.exposeInMainWorld("electronAPI", {
    getProjects: (): Promise<ProjectOverview[]> => ipcRenderer.invoke("dialog:getProjects"),

    getProject: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getProject", project),
    getStudents: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getStudents", project),
    getTeachers: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getTeachers", project),
    getCourses: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getCourses", project),
    getMentorLessons: (project: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getMentorLessons", project),

    createProject: (projectID: ProjectID, name: string): Promise<ProjectID> => ipcRenderer.invoke("dialog:createProject", projectID, name),
    createCourse: (projectID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID> => ipcRenderer.invoke("dialog:createCourse", projectID, teacherID, grade, name),
    createMentorLesson: (projectID: ProjectID, day: Days, lesson: number, teacherID: TeacherID): Promise<MentorLessonID> => ipcRenderer.invoke("dialog:createMentorLesson", projectID, day, lesson, teacherID),
    createStudent: (projectID: ProjectID, name: string, surname: string, grade: string): Promise<StudentID> => ipcRenderer.invoke("dialog:createStudent", projectID, name, surname, grade),
    createTeacher: (projectID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID> => ipcRenderer.invoke("dialog:createTeacher", projectID, surname, name, shorthand),
});