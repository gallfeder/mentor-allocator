import {Day, MentorLessonID, Project, Student, Teacher, TeacherID} from "../../../shared/types";
import {app} from "electron";
import {compile} from "node-tectonic";
import {v4 as getUUID} from 'uuid';
import {accessSync, mkdirSync, rename, rmdir} from "node:fs";
import path from "node:path";
import constants from "node:constants";


export interface MentorLessonData {
    teacher: Teacher;
    grade: string;
    students: Set<Student>;
    day: Day;
    lesson: number;
}

export const extractMentorLessonData = (project: Project, includeGrades?: Set<string>): MentorLessonData[] => {
    const teachers = new Map<TeacherID, Teacher>(project.teachers.map(t => [t.id, t]));
    const allocations = new Map<MentorLessonID, Set<Student>>(project.mentorLessons.map(ml => [ml.id, new Set<Student>()]));

    for (const s of project.students) {
        if (s.mentorLessonId == -1) {
            continue;
        }
        allocations.get(s.mentorLessonId)?.add(s);
    }

    return project.mentorLessons.map(ml => {
        if (includeGrades != undefined && !includeGrades.has(ml.grade)) {
            return undefined;
        }
        const t = teachers.get(ml.teacherId);
        if (!t) {
            return undefined;
        }
        const students = allocations.get(ml.id);

        return {
            teacher: t,
            grade: ml.grade,
            students: students ?? new Set<Student>(),
            day: ml.day,
            lesson: ml.lesson,
        }
    }).filter(e => e != undefined);
}

export const getTeacherName = (t: Teacher): string => {
    if (t.surname.length != 0 && t.name.length != 0) {
        return `${t.name} ${t.surname}`
    }
    if (t.surname.length != 0) {
        return t.surname;
    }
    if (t.name.length != 0) {
        return t.name;
    }
    return t.shorthand;
}

export const getStudentName = (s: Student): string => {
    if (s.name.length == 0 && s.surname.length == 0) {
        return "";
    }
    if (s.name.length == 0) {
        return s.surname;
    }
    if (s.surname.length == 0) {
        return s.name;
    }
    return `${s.surname}, ${s.name}`;
}

export const getLessonDate = (day: Day, lesson: number): string => {
    if (day == Day.Unspecified && lesson < 1) {
        return "";
    }

    const lessonStr = `${lesson}. Stunde`;
    const appendLesson = (str: string): string => {
        if (lesson < 1) {
            return str;
        }
        if (str.length == 0) {
            return lessonStr;
        }
        return `${str}, ${lessonStr}`;
    }

    switch (day) {
        case Day.Monday:    return appendLesson("Montag");
        case Day.Tuesday:   return appendLesson("Dienstag");
        case Day.Wednesday: return appendLesson("Mittwoch");
        case Day.Thursday:  return appendLesson("Donnerstag");
        case Day.Friday:    return appendLesson("Freitag");
        case Day.Saturday:  return appendLesson("Samstag");
        case Day.Sunday:    return appendLesson("Sonntag");
        default:            return lessonStr;
    }
}

export const makeLaTeXStringFromValues = <T>(values: T[], converterFn: (value: T, i: number) => string, fallback: string): string => {
    if (values.length == 0) {
        return fallback;
    }

    const str = values.map((val, i) => converterFn(val, i)).reduce((previousValue, currentValue) => currentValue.length != 0 ? previousValue + "\n" + currentValue : previousValue);
    return str.length != 0 ? str : fallback;
}


export const compileLaTeXToPath = async (pdfPath: string, latex: string): Promise<boolean> => {
    if (pdfPath.length == 0) {
        return false;
    }

    try {
        accessSync(path.dirname(pdfPath), constants.W_OK)
    } catch {
        console.log("Could not access provided path. Missing write permission or parent directory doesn't exist!");
        return false;
    }

    const compID = getUUID();
    const buildDir = `${app.getPath("temp")}/${app.getName()}/latex/${compID}`;

    mkdirSync(buildDir, {recursive: true});

    console.log("LaTeX: Starting to compile...");
    try {
        const result = await compile({
            tex: latex,
            cwd: buildDir,
            timeout: 120000,
        });

        if (!result.success) {
            console.error(`LaTeX: Compiling failed: ${result.failure?.message}`);
            return false;
        }

        console.log("LaTeX: Compiling succeeded. Moving to path...");

        return new Promise<boolean>(resolve => {
            rename(result.pdfPath!, pdfPath, err => {
                if (err) {
                    console.error(`LaTeX: Moving file failed: ${err.message}`);
                    resolve(false);
                    return ;
                }
                console.log("LaTeX: Moving to path succeeded! Starting cleanup!");
                rmdir(buildDir, err => {
                    if (err != null) {
                        console.error(`LaTeX: Error during cleanup: ${err}`);
                    } else {
                        console.log("LaTeX: Cleanup successful!");
                    }
                });
                resolve(true);
            });
        });
    } catch (e) {
        console.error(`LaTeX: Compiling failed (error caught): ${e}`);
        return false;
    }
}
