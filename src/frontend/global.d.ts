import {
    Course,
    CourseID, Days,
    MentorLesson, MentorLessonID,
    Project,
    ProjectID,
    ProjectOverview,
    Student, StudentID,
    Teacher,
    TeacherID
} from "../shared/types";


declare global {
    interface Window {
        electronAPI: {
            getProjects: () => Promise<ProjectOverview[]>,

            getProject: (projectID: ProjectID) => Promise<Project>,
            getStudents: (projectID: ProjectID) => Promise<Student>,
            getTeachers: (projectID: ProjectID) => Promise<Teacher>,
            getCourses: (projectID: ProjectID) => Promise<Course>,
            getMentorLessons: (projectID: ProjectID) => Promise<MentorLesson>,

            createProject: (projectID: ProjectID, name: string) => Promise<ProjectID>,
            createCourse: (projectID: ProjectID, teacherID: TeacherID, grade: string, name: string) => Promise<CourseID>,
            createMentorLesson: (projectID: ProjectID, day: Days, lesson: number, teacherID: TeacherID) => Promise<MentorLessonID>,
            createStudent: (projectID: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID>,
            createTeacher: (projectID: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID>,
        }
    }
}
