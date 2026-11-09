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
} from "../../../shared/types";
import Database from "./interface";
import {existsSync, readdir, readFile, writeFile} from "node:fs";

export default class JSONDatabase implements Database {
    private path: string;

    constructor() {
        this.path = "./data";
    }

    private async readProject(id: ProjectID): Promise<StoredProject | undefined> {
        return new Promise<StoredProject | undefined>(resolve => {
            readFile(`${this.path}/${makeFileName(id)}`, (err, data) => {
                if (err) {
                    if (err.code == "ENOENT") {
                        console.log("Did not find the requested project!");
                        resolve(undefined);
                        return;
                    }
                    console.error(`Error while reading saved project: ${err}`);
                    resolve(undefined);
                    return;
                }

                resolve(parseJSON<StoredProject>(data.toString()));
            })
        });
    }
    private async hasSavedProject(id: ProjectID): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            try {
                const exists = existsSync(`${this.path}/${makeFileName(id)}`);
                resolve(exists);
            } catch (e) {
                console.error(`Encountered error while checking if has saved project: ${e}`);
                resolve(false);
            }
        })
    }
    private async writeCurrentSavedProject(id: ProjectID, proj: StoredProject): Promise<void> {
        proj.lastEdit = Date.now();
        return new Promise<void>((resolve, reject) => {
            writeFile(`${this.path}/${makeFileName(id)}`, JSON.stringify(proj), err => {
                if (err) {
                    console.error(`Error while writing project: ${err}`);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    async createProject(identifier: ProjectID, name: string): Promise<void> {
        if (await this.hasSavedProject(identifier)) {
            throw new Error("Project already exists!");
        }

        try {
            await this.writeCurrentSavedProject(identifier, {
                name: name,
                dataVersion: 1,
                courses: [],
                mentorLessons: [],
                students: [],
                teachers: [],
                lastEdit: Date.now(),
            });
        } catch (e) {
            console.error(`Failed to create project ${identifier}: ${e}`);
            throw new Error("Failed to create project!");
        }
    };

    async createStudent(project: ProjectID, name: string, surname: string, grade: string): Promise<StudentID> {
        if (!await this.hasSavedProject(project)) {
            return -1;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            return -1;
        }
        const highestID = getHighestID(proj.students, (s) => s.id);

        proj.students.push({
            grade: grade,
            id: highestID + 1,
            mentorLesson: -1,
            name: name,
            surname: surname
        });
        await this.writeCurrentSavedProject(project, proj);

        return highestID + 1;
    };

    async createTeacher(project: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID> {
        if (!await this.hasSavedProject(project)) {
            return -1;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            return -1;
        }
        const highestID = getHighestID(proj.teachers, (e) => e.id);

        proj.teachers.push({
            id: highestID + 1,
            name: name ?? "",
            shorthand: shorthand ?? "",
            surname: surname,
        });
        await this.writeCurrentSavedProject(project, proj);

        return highestID + 1;
    };

    async createMentorLesson(project: ProjectID, day: Day, lesson: number, teacher: TeacherID): Promise<MentorLessonID> {
        if (!await this.hasSavedProject(project)) {
            return -1;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            return -1;
        }
        const highestID = getHighestID(proj.mentorLessons, (e) => e.id);

        proj.mentorLessons.push({
            id: highestID + 1,
            day: day,
            grade: "",
            lesson: lesson,
            teacher: teacher,
        });
        await this.writeCurrentSavedProject(project, proj);

        return highestID + 1;
    }

    async createCourse(project: ProjectID, teacher: TeacherID, grade: string, name: string): Promise<CourseID> {
        if (!await this.hasSavedProject(project)) {
            return -1;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            return -1;
        }
        const highestID = getHighestID(proj.courses, (e) => e.id);

        proj.courses.push({
            id: highestID + 1,
            teacher: teacher,
            grade: grade,
            name: name,
            students: [],

        });
        await this.writeCurrentSavedProject(project, proj);

        return highestID + 1;
    }

    async allocateStudent(project: ProjectID, lesson: MentorLessonID, student: StudentID): Promise<void> {
        if (!await this.hasSavedProject(project)) {
            return;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            return;
        }

        const studentIndex = proj.students.findIndex(i => i.id = student);
        proj.students[studentIndex].mentorLesson = lesson;

        await this.writeCurrentSavedProject(project, proj);

        return;
    };

    async allocateStudents(project: ProjectID, lesson: MentorLessonID, students: StudentID[]): Promise<void> {
        if (!await this.hasSavedProject(project)) {
            return;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            return;
        }
        const shouldBeChanged = (sID: StudentID): boolean => {
            for (const s of students) {
                if (sID == s) {
                    return true;
                }
            }
            return false;
        }

        for (const s of proj.students) {
            if (shouldBeChanged(s.id)) {
                s.mentorLesson = lesson;
            }
        }

        await this.writeCurrentSavedProject(project, proj);

        return;
    };

    async getProjects(): Promise<ProjectOverview[]> {
        const files = await listFilesInDirectory(this.path, "json");

        const getProjectOverview = async (prID: ProjectID): Promise<ProjectOverview | undefined> => {
            const p = await this.readProject(prID);
            if (!p) {
                return undefined;
            }

            return {
                id: prID,
                name: p.name,
                courses: p.courses.length,
                mentorLessons: p.mentorLessons.length,
                students: p.students.length,
                teachers: p.teachers.length,
                lastEdit: new Date(p.lastEdit),
                unallocatedStudents: ((): number => {
                    let unalloc = 0;
                    for (const s of p.students) {
                        if (s.mentorLesson < 1) {
                            unalloc++;
                        }
                    }
                    return unalloc;
                })()
            }
        }

        const projectsWG: Promise<ProjectOverview | undefined>[] = [];


        for (const file of files) {
            projectsWG.push(getProjectOverview(makeID(file)));
        }

        return (await Promise.all(projectsWG)).filter(p => p != undefined);
    }

    async getProject(id: ProjectID): Promise<Project> {
        const invalidProject: Project = {
            id: id,
            name: "Invalid Project",
            dataVersion: -1,
            courses: [],
            mentorLessons: [],
            students: [],
            teachers: [],
            lastEdit: new Date(),
        }

        if (!await this.hasSavedProject(id)) {
            return invalidProject;
        }
        const proj = await this.readProject(id);
        if (!proj) {
            return invalidProject;
        }

        return {
            ...proj,
            id: id,
            lastEdit: new Date(proj.lastEdit),
        }
    }

    async getStudents(id: ProjectID): Promise<Student[]> {
        if (!await this.hasSavedProject(id)) {
            return [];
        }
        const proj = await this.readProject(id);
        if (!proj) {
            return [];
        }

        return proj.students;
    }

    async getTeachers(id: ProjectID): Promise<Teacher[]> {
        if (!await this.hasSavedProject(id)) {
            return [];
        }
        const proj = await this.readProject(id);
        if (!proj) {
            return [];
        }

        return proj.teachers;
    }

    async getCourses(id: ProjectID): Promise<Course[]> {
        if (!await this.hasSavedProject(id)) {
            return [];
        }
        const proj = await this.readProject(id);
        if (!proj) {
            return [];
        }

        return proj.courses;
    }

    async getMentorLessons(id: ProjectID): Promise<MentorLesson[]> {
        if (!await this.hasSavedProject(id)) {
            return [];
        }
        const proj = await this.readProject(id);
        if (!proj) {
            return [];
        }

        return proj.mentorLessons;
    }

    async editProjectName(project: ProjectID, name: string): Promise<void | undefined> {
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            return undefined;
        }

        proj.name = name;

        await this.writeCurrentSavedProject(project, proj);
    }

    async editStudent(project: ProjectID, student: StudentID, name?: string, surname?: string, grade?: string): Promise<Student | undefined> {
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            return undefined;
        }

        const i = proj.students.findIndex(i => i.id = student);
        if (i < 0) {
            console.log(`Did not find student with ID ${student} to edit!`);
            return undefined;
        }
        const s = proj.students[i];
        if (name) {
            s.name = name;
        }
        if (surname) {
            s.surname = surname;
        }
        if (grade) {
            s.grade = grade;
        }

        await this.writeCurrentSavedProject(project, proj);
        return s;
    }

    async editTeacher(project: ProjectID, teacher: TeacherID, surname?: string, name?: string, shorthand?: string): Promise<Teacher | undefined> {
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            return undefined;
        }

        const i = proj.teachers.findIndex(i => i.id = teacher);
        if (i < 0) {
            console.log(`Did not find teacher with ID ${teacher} to edit!`);
            return undefined;
        }
        const t = proj.teachers[i];
        if (name) {
            t.name = name;
        }
        if (surname) {
            t.surname = surname;
        }
        if (shorthand) {
            t.shorthand = shorthand;
        }

        await this.writeCurrentSavedProject(project, proj);
        return t;
    }

    async editMentorLesson(project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> {
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            return undefined;
        }

        const i = proj.mentorLessons.findIndex(i => i.id = mentorLesson);
        if (i < 0) {
            console.log(`Did not find mentor lesson with ID ${mentorLesson} to edit!`);
            return undefined;
        }
        const m = proj.mentorLessons[i];
        if (day) {
            m.day = day;
        }
        if (lesson) {
            m.lesson = lesson;
        }
        if (teacher) {
            m.teacher = teacher;
        }

        await this.writeCurrentSavedProject(project, proj);
        return m;
    }

    async editCourse(project: ProjectID, course: CourseID, teacher?: TeacherID, grade?: string, name?: string): Promise<Course | undefined> {
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            return undefined;
        }

        const i = proj.courses.findIndex(i => i.id = course);
        if (i < 0) {
            console.log(`Did not find course with ID ${course} to edit!`);
            return undefined;
        }
        const c = proj.courses[i];
        if (name) {
            c.name = name;
        }
        if (teacher) {
            c.teacher = teacher;
        }
        if (grade) {
            c.grade = grade;
        }

        await this.writeCurrentSavedProject(project, proj);
        return c;
    }

}

const listFilesInDirectory = async (directory: string, fileExtension: string): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
        readdir(directory, {withFileTypes: true}, (err, files) => {
            if (err) {
                console.error(`Failed to list all files in directory "${directory}": ${err}`)
                reject(err);
            }
            const f: string[] = [];

            for (const file of files) {
                if (!file.isFile()) {
                    continue;
                }
                if (file.name.endsWith(`.${fileExtension}`)) {
                    f.push(file.name);
                }
            }
            resolve(f);
        });
    });
}

const parseJSON = <T>(str: string): T | undefined => {
    try {
        const obj: T = JSON.parse(str);
        return obj;
    } catch {
        return undefined;
    }
}

const makeFileName = (id: ProjectID) => `${id}.json`;
const makeID = (path: string): ProjectID => (path.slice(0, path.length - 5) as ProjectID);

const getHighestID = <T>(elems: T[], getElementID: (e: T) => number) => {
    let highest = -Infinity;
    for (const elem of elems) {
        const id = getElementID(elem);
        if (id > highest) {
            highest = id;
        }
    }
    return highest == -Infinity ? 1 : highest;
}

interface StoredProject {
    name: string;
    dataVersion: number;
    students: Student[];
    courses: Course[];
    teachers: Teacher[];
    mentorLessons: MentorLesson[];
    lastEdit: number;
}
