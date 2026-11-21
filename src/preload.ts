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
import {ImportSettings} from "./shared/import";
import {ExportSettings} from "./shared/export";


contextBridge.exposeInMainWorld("electronAPI", {
    getProjects: (): Promise<ProjectOverview[]> => ipcRenderer.invoke("dialog:getProjects"),

    getProject: (projectID: ProjectID): Promise<Project | undefined> => ipcRenderer.invoke("dialog:getProject", projectID),
    getStudents: (projectID: ProjectID): Promise<Student[]> => ipcRenderer.invoke("dialog:getStudents", projectID),
    getTeachers: (projectID: ProjectID): Promise<Teacher[]> => ipcRenderer.invoke("dialog:getTeachers", projectID),
    getCourses: (projectID: ProjectID): Promise<Course[]> => ipcRenderer.invoke("dialog:getCourses", projectID),
    getMentorLessons: (projectID: ProjectID): Promise<MentorLesson[]> => ipcRenderer.invoke("dialog:getMentorLessons", projectID),

    createProject: (name: string, importSettings?: ImportSettings): Promise<ProjectID | undefined> => ipcRenderer.invoke("dialog:createProject", name, importSettings),
    createCourse: (projectID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID | undefined> => ipcRenderer.invoke("dialog:createCourse", projectID, teacherID, grade, name),
    createMentorLesson: (projectID: ProjectID, day: Day, lesson: number, teacherID: TeacherID, grade: string): Promise<MentorLessonID | undefined> => ipcRenderer.invoke("dialog:createMentorLesson", projectID, day, lesson, teacherID, grade),
    createStudent: (projectID: ProjectID, name: string, surname: string, grade: string): Promise<StudentID | undefined> => ipcRenderer.invoke("dialog:createStudent", projectID, name, surname, grade),
    createTeacher: (projectID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID | undefined> => ipcRenderer.invoke("dialog:createTeacher", projectID, surname, name, shorthand),

    editProjectName: (projectID: ProjectID, name: string): Promise<boolean> => ipcRenderer.invoke("dialog:editProjectName", projectID, name),
    editStudent: (projectID: ProjectID, studentID: StudentID, name?: string, surname?: string, grade?: string): Promise<Student | undefined> => ipcRenderer.invoke("dialog:editStudent", projectID, studentID, name, surname, grade),
    editTeacher: (projectID: ProjectID, teacherID: TeacherID, surname?: string, name?: string, shorthand?: string, grade?: string): Promise<Teacher | undefined> => ipcRenderer.invoke("dialog:editTeacher", projectID, teacherID, surname, name, shorthand, grade),
    editMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> => ipcRenderer.invoke("dialog:editMentorLesson", projectID, mentorLessonID, day, lesson, teacher),
    editCourse: (projectID: ProjectID, courseID: CourseID, teacher?: TeacherID, grade?: string, name?: string): Promise<Course | undefined> => ipcRenderer.invoke("dialog:editCourse", projectID, courseID, teacher, grade, name),

    allocateStudents: (projectID: ProjectID, lessonID: MentorLessonID, studentIDs: StudentID | StudentID[]): Promise<boolean> => ipcRenderer.invoke("dialog:allocateStudents", projectID, lessonID, studentIDs),
    automaticallyAllocateStudents: (projectID: ProjectID): Promise<Student[] | undefined> => ipcRenderer.invoke("dialog:automaticallyAllocateStudents", projectID),
    getFilePathFromUser: (title?: string): Promise<string | undefined> => ipcRenderer.invoke("dialog:getFilePathFromUser", title),

    deleteProject: (projectID: ProjectID): Promise<boolean> => ipcRenderer.invoke("dialog:deleteProject", projectID),
    deleteStudent: (projectID: ProjectID, studentID: StudentID): Promise<boolean> => ipcRenderer.invoke("dialog:deleteStudent", projectID, studentID),
    deleteTeacher: (projectID: ProjectID, teacherID: TeacherID): Promise<boolean> => ipcRenderer.invoke("dialog:deleteTeacher", projectID, teacherID),
    deleteCourse: (projectID: ProjectID, courseID: CourseID): Promise<boolean> => ipcRenderer.invoke("dialog:deleteCourse", projectID, courseID),
    deleteMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID): Promise<boolean> => ipcRenderer.invoke("dialog:deleteMentorLesson", projectID, mentorLessonID),

    exportProject: (projectID: ProjectID, settings: ExportSettings): Promise<boolean> => ipcRenderer.invoke("dialog:exportProject", projectID, settings),
});