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
} from "../../shared/types";
import JSONDatabase from "../infrastructure/database/json";
import Database from "../infrastructure/database/interface";
import {v4 as getUUID} from 'uuid';
import {importFromUntisFiles} from "../infrastructure/import/untis";

const db: Database = new JSONDatabase();

export const getAllProjects = (): Promise<ProjectOverview[]> => {
    return db.getProjects();
}

export const getProject = (id: ProjectID): Promise<Project | undefined> => {
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

export const createProject = async (name: string): Promise<ProjectID | undefined> => {
    if (name == "") {
        return undefined;
    }
    const prID = getUUID();
    return await db.createProject(prID, name) == undefined ? prID : undefined;
}

export const createStudentInProject = async (prID: ProjectID, name: string, surname: string, grade: string): Promise<StudentID | undefined> => {
    if (prID == "" || name == "" || surname == "" || grade == "") {
        return undefined;
    }

    return db.createStudent(prID, name, surname, grade);
}

export const createTeacherInProject = async (prID: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID | undefined> => {
    if (prID == "" || name == "") {
        return undefined;
    }

    return db.createTeacher(prID, surname, name, shorthand);
}

export const createMentorLessonInProject = async (prID: ProjectID, day: Day, lesson: number, teacherID: TeacherID): Promise<MentorLessonID | undefined> => {
    if (prID == "" || lesson < 0 || teacherID < 1) {
        return undefined;
    }

    return db.createMentorLesson(prID, day, lesson, teacherID);
}

export const createCourseInProject = async (prID: ProjectID, teacherID: TeacherID, grade: string, name: string): Promise<CourseID | undefined> => {
    if (prID == "" || teacherID < 1 || grade == "" || name == "") {
        return undefined;
    }

    return db.createCourse(prID, teacherID, grade, name)
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

export const editMentorLessonInProject = async (project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> => {
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

export const allocateStudentsToLesson = (project: ProjectID, lesson: MentorLessonID, students: StudentID | StudentID[]): Promise<void | undefined> => {
    if (Array.isArray(students)) {
        return db.allocateStudents(project, lesson, students);
    }
    return db.allocateStudent(project, lesson, students);
}


export const createProjectWithUntisImport = async (name: string, pathGPU001: string, pathGPU015: string): Promise<ProjectID | undefined> => {
    if (name == "" || pathGPU001 == "" || pathGPU015 == "") {
        return undefined;
    }

    const data = await importFromUntisFiles(pathGPU001, pathGPU015);
    if (!data) {
        return undefined;
    }
    const prID = await createProject(name);
    if (!prID) {
        return prID;
    }

    const results = await Promise.all([
        db.setStudents(prID, data.students),
        db.setTeachers(prID, data.teacher),
        db.setCourses(prID, data.courses),
        db.setMentorLessons(prID, data.mentorLessons),
    ]);
    if (results.findIndex(e => e == undefined) != -1) {
        await db.deleteProject(prID);
        return undefined;
    }

    return prID;
}

export const deleteProject = async (prID: ProjectID): Promise<void | undefined> => {
    if (prID.length == 0) {
        return;
    }
    return db.deleteProject(prID);
}

export const deleteStudent = async (prID: ProjectID, id: StudentID): Promise<void | undefined> => {
    if (prID.length == 0) {
        return;
    }
    return db.deleteStudent(prID, id);
}

export const deleteTeacher = async (prID: ProjectID, id: TeacherID): Promise<void | undefined> => {
    if (prID.length == 0) {
        return;
    }
    return db.deleteTeacher(prID, id);
}

export const deleteCourse = async (prID: ProjectID, id: CourseID): Promise<void | undefined> => {
    if (prID.length == 0) {
        return;
    }
    return db.deleteCourse(prID, id);
}

export const deleteMentorLesson = async (prID: ProjectID, id: MentorLessonID): Promise<void | undefined> => {
    if (prID.length == 0) {
        return;
    }
    return db.deleteMentorLesson(prID, id);
}


