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
import {existsSync, mkdirSync, readdir, readFile, unlink, writeFile} from "node:fs";
import Mutex from "../files/Mutex";
import {app} from "electron";

export default class JSONDatabase implements Database {
    private path: string;
    private mutex: Mutex;

    constructor() {
        this.path = `${app.getPath("appData")}/mentor-allocator/db_json_data`;
        this.mutex = new Mutex();

        if (!existsSync(this.path)) {
            mkdirSync(this.path, {recursive: true});
        }
    }

    private getPath(id: ProjectID): string {
        return `${this.path}/${makeFileName(id)}`;
    }

    private async readProject(id: ProjectID): Promise<StoredProject | undefined> {
        return new Promise<StoredProject | undefined>(resolve => {
            readFile(this.getPath(id), (err, data) => {
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
                const exists = existsSync(this.getPath(id));
                resolve(exists);
            } catch (e) {
                console.error(`Encountered error while checking if has saved project: ${e}`);
                resolve(false);
            }
        })
    }
    private async writeProject(id: ProjectID, proj: StoredProject): Promise<void> {
        proj.lastEdit = Date.now();
        return new Promise<void>((resolve, reject) => {
            writeFile(this.getPath(id), JSON.stringify(proj), err => {
                if (err) {
                    console.error(`Error while writing project: ${err}`);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    async createProject(identifier: ProjectID, name: string): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(identifier));
        if (await this.hasSavedProject(identifier)) {
            close();
            return false;
        }
        try {
            await this.writeProject(identifier, {
                name: name,
                dataVersion: 1,
                courses: [],
                mentorLessons: [],
                students: [],
                teachers: [],
                lastEdit: Date.now(),
            });
            close();
            return true;
        } catch (e) {
            close();
            console.error(`Failed to create project ${identifier}: ${e}`);
            return false;
        }
    };

    async createStudent(project: ProjectID, name: string, surname: string, grade: string): Promise<StudentID | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            close();
            return undefined;
        }

        const proj = await this.readProject(project);
        if (!proj) {
            close();
            return undefined;
        }
        const highestID = getHighestID(proj.students, (s) => s.id);

        proj.students.push({
            grade: grade,
            id: highestID + 1,
            mentorLessonId: -1,
            name: name,
            surname: surname
        });
        await this.writeProject(project, proj);

        close();
        return highestID + 1;
    };

    async createTeacher(project: ProjectID, surname: string, name?: string, shorthand?: string): Promise<TeacherID | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            close();
            return undefined;
        }
        const highestID = getHighestID(proj.teachers, (e) => e.id);

        proj.teachers.push({
            id: highestID + 1,
            name: name ?? "",
            shorthand: shorthand ?? "",
            surname: surname,
        });
        await this.writeProject(project, proj);

        close();
        return highestID + 1;
    };

    async createMentorLesson(project: ProjectID, day: Day, lesson: number, teacher: TeacherID, grade: string): Promise<MentorLessonID | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            close();
            return undefined;
        }
        const highestID = getHighestID(proj.mentorLessons, (e) => e.id);

        proj.mentorLessons.push({
            id: highestID + 1,
            day: day,
            grade: grade,
            lesson: lesson,
            teacherId: teacher,
        });
        await this.writeProject(project, proj);

        close();
        return highestID + 1;
    }

    async createCourse(project: ProjectID, teacher: TeacherID, grade: string, name: string): Promise<CourseID | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            close();
            return undefined;
        }
        const highestID = getHighestID(proj.courses, (e) => e.id);

        proj.courses.push({
            id: highestID + 1,
            teacher: teacher,
            grade: grade,
            name: name,
            students: [],

        });
        await this.writeProject(project, proj);

        close()
        return highestID + 1;
    }

    async allocateStudent(project: ProjectID, lesson: MentorLessonID, student: StudentID): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            close();
            return false;
        }

        const studentIndex = proj.students.findIndex(i => i.id = student);
        proj.students[studentIndex].mentorLessonId = lesson;

        await this.writeProject(project, proj);

        close();
        return true;
    };

    async allocateStudents(project: ProjectID, lesson: MentorLessonID, students: StudentID[]): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            close();
            return false;
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
                s.mentorLessonId = lesson;
            }
        }

        await this.writeProject(project, proj);

        close();
        return true;
    };

    async getProjects(): Promise<ProjectOverview[]> {
        let files: string[];
        try {
            files = await listFilesInDirectory(this.path, "json");
        } catch {
            return [];
        }
        if (!files || files.length == 0) {
            return [];
        }

        const getProjectOverview = async (prID: ProjectID): Promise<ProjectOverview | undefined> => {
            const close = await this.mutex.blockFile(this.getPath(prID));
            const p = await this.readProject(prID);
            close();
            if (!p) {
                return undefined;
            }

            return {
                id: prID,
                name: p.name,
                coursesCount: p.courses.length,
                mentorLessonsCount: p.mentorLessons.length,
                studentsCount: p.students.length,
                teachersCount: p.teachers.length,
                lastEditDate: new Date(p.lastEdit),
                unallocatedStudentsCount: ((): number => {
                    let unalloc = 0;
                    for (const s of p.students) {
                        if (s.mentorLessonId < 1) {
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

    async getProject(id: ProjectID): Promise<Project | undefined> {
        const close = await this.mutex.blockFile(this.getPath(id));
        if (!await this.hasSavedProject(id)) {
            close();
            return undefined;
        }
        const proj = await this.readProject(id);
        close();
        if (!proj) {
            return undefined;
        }

        return {
            ...proj,
            id: id,
            lastEdit: new Date(proj.lastEdit),
        }
    }

    async getStudents(id: ProjectID): Promise<Student[]> {
        const close = await this.mutex.blockFile(this.getPath(id));
        if (!await this.hasSavedProject(id)) {
            close()
            return [];
        }
        const proj = await this.readProject(id);
        close();
        if (!proj) {
            return [];
        }

        return proj.students;
    }

    async getTeachers(id: ProjectID): Promise<Teacher[]> {
        const close = await this.mutex.blockFile(this.getPath(id));
        if (!await this.hasSavedProject(id)) {
            close();
            return [];
        }
        const proj = await this.readProject(id);
        close();
        if (!proj) {
            return [];
        }

        return proj.teachers;
    }

    async getCourses(id: ProjectID): Promise<Course[]> {
        const close = await this.mutex.blockFile(this.getPath(id));
        if (!await this.hasSavedProject(id)) {
            close();
            return [];
        }
        const proj = await this.readProject(id);
        close();
        if (!proj) {
            return [];
        }

        return proj.courses;
    }

    async getMentorLessons(id: ProjectID): Promise<MentorLesson[]> {
        const close = await this.mutex.blockFile(this.getPath(id));
        if (!await this.hasSavedProject(id)) {
            close();
            return [];
        }
        const proj = await this.readProject(id);
        close();
        if (!proj) {
            return [];
        }

        return proj.mentorLessons;
    }

    async editProjectName(project: ProjectID, name: string): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.name = name;

        await this.writeProject(project, proj);
        close();
        return true;
    }

    async editStudent(project: ProjectID, student: StudentID, name?: string, surname?: string, grade?: string): Promise<Student | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return undefined;
        }

        const i = proj.students.findIndex(i => i.id == student);
        if (i < 0) {
            console.log(`Did not find student with ID ${student} to edit!`);
            close();
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

        await this.writeProject(project, proj);
        close();
        return s;
    }

    async editTeacher(project: ProjectID, teacher: TeacherID, surname?: string, name?: string, shorthand?: string): Promise<Teacher | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return undefined;
        }

        const i = proj.teachers.findIndex(i => i.id == teacher);
        if (i < 0) {
            console.log(`Did not find teacher with ID ${teacher} to edit!`);
            close();
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

        await this.writeProject(project, proj);
        close();
        return t;
    }

    async editMentorLesson(project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID, grade?: string): Promise<MentorLesson | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return undefined;
        }

        const i = proj.mentorLessons.findIndex(i => i.id == mentorLesson);
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
            m.teacherId = teacher;
        }
        if (grade) {
            m.grade = grade;
        }

        await this.writeProject(project, proj);
        close();
        return m;
    }

    async editCourse(project: ProjectID, course: CourseID, teacher?: TeacherID, grade?: string, name?: string): Promise<Course | undefined> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return undefined;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return undefined;
        }

        const i = proj.courses.findIndex(i => i.id == course);
        if (i < 0) {
            console.log(`Did not find course with ID ${course} to edit!`);
            close();
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

        await this.writeProject(project, proj);
        close();
        return c;
    }

    async deleteProject(project: ProjectID): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        return new Promise<boolean>(resolve => {
            unlink(this.getPath(project), err => {
               if (err) {
                   console.error(`Encountered error while deleting project ${project}: ${err}`);
                   close();
                   resolve(false);
                   return;
               }
               close();
               resolve(true);
            });
        });
    }


    async deleteStudent(project: ProjectID, student: StudentID): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.students = proj.students.filter(i => i.id != student);

        for (const course of proj.courses) {
            course.students = course.students.filter(sID => sID != student);
        }

        await this.writeProject(project, proj);
        close();
        return true;
    }

    async deleteTeacher(project: ProjectID, teacher: TeacherID): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.teachers = proj.teachers.filter(i => i.id != teacher);
        for (const ml of proj.mentorLessons) {
            if (ml.teacherId == teacher) {
                ml.teacherId = -1;
            }
        }

        for (const course of proj.courses) {
            if (course.teacher == teacher) {
                course.teacher = -1;
            }
        }

        await this.writeProject(project, proj);
        close();
        return true;
    }

    async deleteCourse(project: ProjectID, course: CourseID): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.courses = proj.courses.filter(i => i.id != course);
        await this.writeProject(project, proj);
        close();
        return true;
    }

    async deleteMentorLesson(project: ProjectID, mentorLesson: MentorLessonID): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.mentorLessons = proj.mentorLessons.filter(i => i.id != mentorLesson);
        for (const student of proj.students) {
            if (student.mentorLessonId == mentorLesson) {
                student.mentorLessonId = -1;
            }
        }
        await this.writeProject(project, proj);
        close();
        return true;
    }


    async setStudents(project: ProjectID, students: Student[]): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.students = students;

        await this.writeProject(project, proj);
        close();
        return true;
    }

    async setTeachers(project: ProjectID, teachers: Teacher[]): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.teachers = teachers;

        await this.writeProject(project, proj);
        close();
        return true;
    }

    async setCourses(project: ProjectID, courses: Course[]): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.courses = courses;

        await this.writeProject(project, proj);
        close();
        return true;
    }

    async setMentorLessons(project: ProjectID, mentorLessons: MentorLesson[]): Promise<boolean> {
        const close = await this.mutex.blockFile(this.getPath(project));
        if (!await this.hasSavedProject(project)) {
            console.log("The provided project does not exist!");
            close();
            return false;
        }
        const proj = await this.readProject(project);
        if (!proj) {
            console.warn(`There was an issue with reading project ${project}!`);
            close();
            return false;
        }

        proj.mentorLessons = mentorLessons;

        await this.writeProject(project, proj);
        close();
        return true;
    }
}

const listFilesInDirectory = async (directory: string, fileExtension: string): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
        readdir(directory, {withFileTypes: true}, (err, files) => {
            if (err) {
                console.error(`Failed to list all files in directory "${directory}": ${err}`)
                reject(err);
            }

            if (!files || files.length == 0) {
                return [];
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
