import { ProjectID, StudentID, TeacherID, Days, MentorLessonID, ProjectOverview } from "../../../shared/types";
import Database from "./interface";
import {readdir, existsSync, readFile, writeFile} from "node:fs";

export default class JSONDatabase implements Database {
    private path: string;

    constructor() {
        this.path = "./data";
    }

    private async readCurrentSavedProject(id: ProjectID): Promise<StoredProject | undefined> {
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
                teachers: []
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
        const proj = await this.readCurrentSavedProject(project);
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
        const proj = await this.readCurrentSavedProject(project);
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

    async createMentorLesson(project: ProjectID, day: Days, lesson: number, teacher: TeacherID): Promise<MentorLessonID> {
        if (!await this.hasSavedProject(project)) {
            return -1;
        }
        const proj = await this.readCurrentSavedProject(project);
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

    async allocateStudent(project: ProjectID, lesson: MentorLessonID, student: StudentID): Promise<void> {
        if (!await this.hasSavedProject(project)) {
            return;
        }
        const proj = await this.readCurrentSavedProject(project);
        if (!proj) {
            return;
        }

        const studentIndex = proj.students.findIndex(i => i.id = student);
        proj.students[studentIndex].mentorLesson = lesson;

        await this.writeCurrentSavedProject(project, proj);

        return;
    };

    async getProjects(): Promise<ProjectOverview[]> {
        const files = await listFilesInDirectory(this.path, "json");
        const projects: ProjectOverview[] = [];
        for (let file of files) {
            const id = makeID(file);
            projects.push({
                id: id,
                name: id, // TODO: Read file to determine actual name!
            })
        }

        return projects;
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

const getHighestID = <T>(elems: T[], fn: (e: T) => number) => {
    let highest = -Infinity;
    for (const elem of elems) {
        const id = fn(elem);
        if (id > highest) {
            highest = id;
        }
    }
    return highest;
}

interface StoredProject {
    name: string;
    dataVersion: number;
    students: StoredStudent[];
    courses: StoredCourse[];
    teachers: StoredTeacher[];
    mentorLessons: StoredMentorLesson[];
}

interface StoredStudent {
    id: StudentID;
    name: string;
    surname: string;
    grade: string;
    mentorLesson: MentorLessonID;
}

interface StoredCourse {
    grade: string;
    name: string;
    teacher: TeacherID;
    students: StudentID[];
}

interface StoredTeacher {
    id: TeacherID;
    shorthand: string;
    name: string;
    surname: string;
}

interface StoredMentorLesson {
    id: MentorLessonID;
    day: Days;
    lesson: number;
    teacher: TeacherID;
    grade: string;
}
