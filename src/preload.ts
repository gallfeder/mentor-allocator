import {contextBridge, ipcRenderer} from "electron";
import {
    Course,
    CourseID,
    Day,
    MentorLesson,
    MentorLessonID,
    Project,
    ProjectID,
    ProjectOverview,
    Student,
    StudentID,
    Teacher,
    TeacherID
} from "./shared/types";


contextBridge.exposeInMainWorld("electronAPI", {
    getProjects: (): Promise<ProjectOverview[]> => ipcRenderer.invoke("dialog:getProjects"),

    getProject: (projectID: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getProject", projectID),
    getStudents: (projectID: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getStudents", projectID),
    getTeachers: (projectID: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getTeachers", projectID),
    getCourses: (projectID: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getCourses", projectID),
    getMentorLessons: (projectID: ProjectID): Promise<Project> => ipcRenderer.invoke("dialog:getMentorLessons", projectID),

    createProject: (name: string): Promise<ProjectID> => ipcRenderer.invoke("dialog:createProject", name),
    createCourse: (projectID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID> => ipcRenderer.invoke("dialog:createCourse", projectID, teacherID, grade, name),
    createMentorLesson: (projectID: ProjectID, day: Day, lesson: number, teacherID: TeacherID): Promise<MentorLessonID> => ipcRenderer.invoke("dialog:createMentorLesson", projectID, day, lesson, teacherID),
    createStudent: (projectID: ProjectID, name: string, surname: string, grade: string): Promise<StudentID> => ipcRenderer.invoke("dialog:createStudent", projectID, name, surname, grade),
    createTeacher: (projectID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID> => ipcRenderer.invoke("dialog:createTeacher", projectID, surname, name, shorthand),

    editProjectName: (projectID: ProjectID, name: string): Promise<void | undefined> => ipcRenderer.invoke("dialog:editProjectName", projectID, name),
    editStudent: (projectID: ProjectID, studentID: StudentID, name?: string, surname?: string, grade?: string): Promise<Student | undefined> => ipcRenderer.invoke("dialog:editStudent", projectID, studentID, name, surname, grade),
    editTeacher: (projectID: ProjectID, teacherID: TeacherID, surname?: string, name?: string, shorthand?: string): Promise<Teacher | undefined> => ipcRenderer.invoke("dialog:editTeacher", projectID, teacherID, surname, name, shorthand),
    editMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> => ipcRenderer.invoke("dialog:editMentorLesson", projectID, mentorLessonID, day, lesson, teacher),
    editCourse: (projectID: ProjectID, courseID: CourseID, teacher?: TeacherID, grade?: string, name?: string): Promise<Course | undefined> => ipcRenderer.invoke("dialog:editCourse", projectID, courseID, teacher, grade, name),
    allocateStudents: (projectID: ProjectID, lessonID: MentorLessonID, studentIDs: StudentID | StudentID[]): Promise<void> => ipcRenderer.invoke("dialog:allocateStudents", projectID, lessonID, studentIDs),

});