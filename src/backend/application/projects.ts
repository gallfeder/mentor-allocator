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
} from "../../shared/types";
import JSONDatabase from "../infrastructure/database/json";
import Database from "../infrastructure/database/interface";

const db: Database = new JSONDatabase();

export const getAllProjects = (): Promise<ProjectOverview[]> => {
    return db.getProjects();
}

export const getProject = (id: ProjectID): Promise<Project> => {
    return db.getProject(id);
}

export const getStudentsOfProject = (project: ProjectID): Promise<Student[]> => {
    return db.getStudents(project);
}

export const getTeachersOfProject = (project: ProjectID): Promise<Teacher[]> => {
    return db.getTeachers(project);
}

export const getCoursesOfProject = (project: ProjectID): Promise<Course[]> => {
    return db.getCourses(project);
}

export const getMentorLessonsOfProject = (project: ProjectID): Promise<MentorLesson[]> => {
    return db.getMentorLessons(project);
}

export const createProject = async (prID: ProjectID, name: string): Promise<ProjectID> => {
    if (prID == "" || name == "") {
        return "";
    }

    try {
        await db.createProject(prID, name);
    } catch (e) {
        return "";
    }
    return prID
}

export const createStudentInProject = async (prID: ProjectID, name: string, surname: string, grade: string): Promise<StudentID> => {
    if (prID == "" || name == "" || surname == "" || grade == "") {
        return -1;
    }

    return db.createStudent(prID, name, surname, grade);
}

export const createTeacherInProject = async (prID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID> => {
    if (prID == "" || name == "") {
        return -1;
    }

    return db.createTeacher(prID, surname, name, shorthand);
}

export const createMentorLessonInProject = async (prID: ProjectID, day: Days, lesson: number, teacherID: TeacherID): Promise<MentorLessonID> => {
    if (prID == "" || lesson < 0 || teacherID < 1) {
        return -1;
    }

    return db.createMentorLesson(prID, day, lesson, teacherID);
}

export const createCourseInProject = async (prID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID> => {
    if (prID == "" || teacherID < 1 || grade == "" || name == "") {
        return -1;
    }

    return db.createCourse(prID, teacherID, grade, name)
}

export const editProjectID = async (project: ProjectID, changed: ProjectID): Promise<ProjectID | undefined> => {
    return db.editProjectID(project, changed);
}

export const editProjectName = async (project: ProjectID, name: string): Promise<void | undefined> => {
    return db.editProjectName(project, name);
}

export const editStudentInProject = async (project: ProjectID, student: StudentID, name?: string, surname?: string, grade?: string): Promise<Student | undefined> => {
    if (!name && !surname && !grade) {
        console.log("Nothing to edit was provided!");
        return undefined;
    }

    return db.editStudent(project, student, name, surname, grade);
}

export const editTeacherInProject = async (project: ProjectID, teacher: TeacherID, surname?: string, name?: string, shorthand?: string): Promise<Teacher | undefined> => {
    if (!name && !surname && !shorthand) {
        console.log("Nothing to edit was provided!");
        return undefined;
    }

    return db.editTeacher(project, teacher, surname, name, shorthand);
}

export const editMentorLessonInProject = async (project: ProjectID, mentorLesson: MentorLessonID, day?: Days, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> => {
    if (!day && !lesson && !teacher) {
        console.log("Nothing to edit was provided!");
        return undefined;
    }

    return db.editMentorLesson(project, mentorLesson, day, lesson, teacher);
}

export const editCourseInProject = async (project: ProjectID, course: CourseID, teacher?: TeacherID, grade?: string, name?: string): Promise<Course | undefined> => {
    if (!teacher && !grade && !name) {
        console.log("Nothing to edit was provided!");
        return undefined;
    }

    return db.editCourse(project, course, teacher, grade, name);
}

