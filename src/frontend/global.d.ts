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
} from "../shared/types";
import {ipcRenderer} from "electron";


declare global {
    interface Window {
        electronAPI: {
            getProjects: () => Promise<ProjectOverview[]>,

            getProject: (projectID: ProjectID) => Promise<Project>,
            getStudents: (projectID: ProjectID) => Promise<Student>,
            getTeachers: (projectID: ProjectID) => Promise<Teacher>,
            getCourses: (projectID: ProjectID) => Promise<Course>,
            getMentorLessons: (projectID: ProjectID) => Promise<MentorLesson>,

            createProject: (name: string) => Promise<ProjectID>,
            createProjectFromUntis: (name: string, pathToGPU001: string, pathToGPU015: string) => Promise<ProjectID>,
            createCourse: (projectID: ProjectID, teacherID: TeacherID, grade: string, name: string) => Promise<CourseID>,
            createMentorLesson: (projectID: ProjectID, day: Day, lesson: number, teacherID: TeacherID) => Promise<MentorLessonID>,
            createStudent: (projectID: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID>,
            createTeacher: (projectID: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID>,

            editProjectName: (projectID: ProjectID, name: string) => Promise<void | undefined>,
            editStudent: (projectID: ProjectID, studentID: StudentID, name?: string, surname?: string, grade?: string) => Promise<Student | undefined>,
            editTeacher: (projectID: ProjectID, teacherID: TeacherID, surname?: string, name?: string, shorthand?: string) => Promise<Teacher | undefined>,
            editMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID) => Promise<MentorLesson | undefined>,
            editCourse: (projectID: ProjectID, courseID: CourseID, teacher?: TeacherID, grade?: string, name?: string) => Promise<Course | undefined>,

            allocateStudents: (projectID: ProjectID, lessonID: MentorLessonID, studentIDs: StudentID | StudentID[]) => Promise<void>,
            getFilePathFromUser: (title?: string) => Promise<string>,

            deleteStudent: (projectID: ProjectID, studentID: StudentID) => Promise<void | undefined>,
            deleteTeacher: (projectID: ProjectID, teacherID: TeacherID) => Promise<void | undefined>,
            deleteCourse: (projectID: ProjectID, courseID: CourseID) => Promise<void | undefined>,
            deleteMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID) => Promise<void | undefined>,
        }
    }
}
