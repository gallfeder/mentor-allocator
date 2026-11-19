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


declare global {
    interface Window {
        electronAPI: {
            getProjects: () => Promise<ProjectOverview[]>,

            getProject: (projectID: ProjectID) => Promise<Project | undefined>,
            getStudents: (projectID: ProjectID) => Promise<Student[]>,
            getTeachers: (projectID: ProjectID) => Promise<Teacher[]>,
            getCourses: (projectID: ProjectID) => Promise<Course[]>,
            getMentorLessons: (projectID: ProjectID) => Promise<MentorLesson[]>,

            createProject: (name: string) => Promise<ProjectID | undefined>,
            createProjectFromUntis: (name: string, pathToGPU001: string, pathToGPU015: string) => Promise<ProjectID | undefined>,
            createCourse: (projectID: ProjectID, teacherID: TeacherID, grade: string, name: string) => Promise<CourseID | undefined>,
            createMentorLesson: (projectID: ProjectID, day: Day, lesson: number, teacherID: TeacherID, grade: string) => Promise<MentorLessonID | undefined>,
            createStudent: (projectID: ProjectID, name: string, surname: string, grade: string) => Promise<StudentID | undefined>,
            createTeacher: (projectID: ProjectID, surname: string, name?: string, shorthand?: string) => Promise<TeacherID | undefined>,

            editProjectName: (projectID: ProjectID, name: string) => Promise<boolean>,
            editStudent: (projectID: ProjectID, studentID: StudentID, name?: string, surname?: string, grade?: string) => Promise<Student | undefined>,
            editTeacher: (projectID: ProjectID, teacherID: TeacherID, surname?: string, name?: string, shorthand?: string) => Promise<Teacher | undefined>,
            editMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID, grade?: string) => Promise<MentorLesson | undefined>,
            editCourse: (projectID: ProjectID, courseID: CourseID, teacher?: TeacherID, grade?: string, name?: string) => Promise<Course | undefined>,

            allocateStudents: (projectID: ProjectID, lessonID: MentorLessonID, studentIDs: StudentID | StudentID[]) => Promise<boolean>,
            automaticallyAllocateStudents: (projectID: ProjectID) => Promise<Student[] | undefined>,
            getFilePathFromUser: (title?: string) => Promise<string | undefined>,

            deleteStudent: (projectID: ProjectID, studentID: StudentID) => Promise<boolean>,
            deleteTeacher: (projectID: ProjectID, teacherID: TeacherID) => Promise<boolean>,
            deleteCourse: (projectID: ProjectID, courseID: CourseID) => Promise<boolean>,
            deleteMentorLesson: (projectID: ProjectID, mentorLessonID: MentorLessonID) => Promise<boolean>,
        }
    }
}
