import {
    Course,
    CourseID,
    Days,
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

            editProjectID:  (projectID: ProjectID, changed: ProjectID) => Promise<ProjectID | undefined>,
            editProjectName: (projectID: ProjectID, name: string) => Promise<void | undefined>,
            editStudent: (projectID: ProjectID, studentID: StudentID, name?: string, surname?: string, grade?: string) => Promise<Student | undefined>,
            editTeacher: (projectID: ProjectID, teacherID: TeacherID, surname?: string, name?: string, shorthand?: string) => Promise<Teacher | undefined>,
            editMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID, day?: Days, lesson?: number, teacher?: TeacherID) => Promise<MentorLesson | undefined>,
            editCourse: (projectID: ProjectID, courseID: CourseID, teacher?: TeacherID, grade?: string, name?: string) => Promise<Course | undefined>,
        }
    }
}
