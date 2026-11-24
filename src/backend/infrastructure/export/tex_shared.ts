import {Day, MentorLessonID, Project, Student, Teacher, TeacherID} from "../../../shared/types";
import {app, shell} from "electron";
import type NodeTectonic from 'node-tectonic';
import {v4 as getUUID} from 'uuid';
import {accessSync, mkdirSync, rmdir, writeFile, writeFileSync} from "node:fs";
import path from "node:path";
import constants from "node:constants";
import os from "node:os";
import {logTiming} from "./tex_timing_log";

const tectonicModulePath = require.resolve('node-tectonic');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compile } = require(app.isPackaged ? tectonicModulePath.replace('app.asar', 'app.asar.unpacked') : tectonicModulePath) as typeof NodeTectonic;



export interface MentorLessonData {
    id: MentorLessonID;
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
            id: ml.id,
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

export const makeTeXStringFromValues = <T>(values: T[], converterFn: (value: T, i: number) => string, fallback: string): string => {
    if (values.length == 0) {
        return fallback;
    }

    const str = values.map((val, i) => converterFn(val, i)).reduce((previousValue, currentValue) => currentValue.length != 0 ? previousValue + "\n" + currentValue : previousValue);
    return str.length != 0 ? str : fallback;
}


interface CompileQueueElement {
    path: string;
    tex: string;
    resolve: (ok: boolean) => void;
}

const compileQueue: CompileQueueElement[] = [];
let activeWorkers = 0;
const maxActiveWorkers = Math.max(os.cpus().length - 2, 1);
const useQueue = false;

export const compileTeXToPath = async (pdfPath: string, tex: string): Promise<boolean> => {
    if (!tectonicCacheInitialisation) {
        initialiseTectonicCache();
    }
    await tectonicCacheInitialisation;

    if (!useQueue) {
        return actuallyCompile(pdfPath, tex);
    }
    return new Promise<boolean>(resolve => {
        if (activeWorkers < maxActiveWorkers) {
            activeWorkers++;
            runCompileLoop({path: pdfPath, tex: tex, resolve: resolve});
            return;
        }

        compileQueue.push({path: pdfPath, tex: tex, resolve: resolve});
    });
}

const runCompileLoop = async (elem: CompileQueueElement) => {
    elem.resolve(await actuallyCompile(elem.path, elem.tex));
    const first = compileQueue.shift();
    if (!first) {
        activeWorkers--;
        return;
    }

    return runCompileLoop(first);
}

const actuallyCompile = async (pdfPath: string, tex: string): Promise<boolean> => {
    if (pdfPath.length == 0) {
        return false;
    }
    const d1 = new Date();
    
    try {
        accessSync(path.dirname(pdfPath), constants.W_OK)
    } catch {
        console.log("Could not access provided path. Missing write permission or parent directory doesn't exist!");
        return false;
    }

    const compID = getUUID();
    const buildDir = `${app.getPath("temp")}/${app.getName()}/TeX/${compID}`;

    mkdirSync(buildDir, {recursive: true});

    console.log("TeX: Starting to compile...");
    const d2 = new Date();
    try {
        const result = await compile({
            tex: tex,
            cwd: buildDir,
            timeout: 120000,
            returnBuffer: true,
            onlyCached: true,
        });

        if (!result.success) {
            console.error(`TeX: Compiling failed: ${result.failure?.message}`);

            if (!app.isPackaged) {
                mkdirSync(path.join(app.getPath("logs"), "faulty-tex"), {recursive: true});
                const logPath = path.join(app.getPath("logs"), "faulty-tex", `${compID}.tex`);
                shell.showItemInFolder(logPath);

                writeFileSync(logPath, tex);
            }

            return false;
        }
        const pdf = result.pdfBuffer!;

        console.log("TeX: Compiling succeeded. Creating .pdf at path...");
        const d3 = new Date();

        return new Promise<boolean>(resolve => {
            writeFile(pdfPath, pdf, err => {
                if (err) {
                    console.error(`TeX: Creating .pdf file failed: ${err.message}`);
                    resolve(false);
                    return ;
                }
                console.log("TeX: Creating .pdf file succeeded! Starting cleanup!");
                const d4 = new Date();

                rmdir(buildDir, err => {
                    if (err != null) {
                        console.error(`TeX: Error during cleanup: ${err}`);
                    } else {
                        console.log("TeX: Cleanup successful!");
                    }
                    const d5 = new Date();
                    logTiming(d1, d2, d3, d4, d5);
                });
                resolve(true);
            });
        });
    } catch (e) {
        console.error(`TeX: Compiling failed (error caught): ${e}`);
        return false;
    }
}

let tectonicCacheInitialisation: null | Promise<boolean> = null;

export const initialiseTectonicCache = () => {
    if (tectonicCacheInitialisation) {
        return;
    }

    tectonicCacheInitialisation = new Promise<boolean>(resolve => {
        console.log("Tectonic: Starting initialisation of cache!");

        const buildDir = `${app.getPath("temp")}/${app.getName()}/TeX/initialisation`;

        mkdirSync(buildDir, {recursive: true});
        compile({
            tex: cacheInitialisationTeX,
            timeout: 120000,
            cwd: buildDir
        }).then(r => {
            if (r.success) {
                console.log("Tectonic: Cache initialisation completed! Starting cleanup...");
                rmdir(buildDir, err => {
                    if (err != null) {
                        console.error(`Tectonic: Error during cleanup: ${err}`);
                    } else {
                        console.log("Tectonic: Cleanup successful!");
                    }
                });
                resolve(true);
                return;
            }
            console.error(`Tectonic: Failed to initialise cache (code: ${r.failure?.code}): ${r.failure?.message}`);
            tectonicCacheInitialisation = null;
            initialiseTectonicCache();
        }).catch(e => {
            console.error(`Tectonic: Failed to initialise cache, throwing error: ${e}`);
            throw new Error(e);
        });
    });
}

const cacheInitialisationTeX = `
\\documentclass[12pt, a4paper, landscape, ngerman]{scrreprt}
\\usepackage[utf8]{inputenc}
\\usepackage[ngerman]{babel}
\\usepackage{fontenc}
\\usepackage[margin=1cm]{geometry}
\\usepackage{array}
\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{multirow}
\\usepackage{fancyhdr}

\\pagestyle{fancy}

\\lfoot{Project title}
\\cfoot{Teacher - Grade}
\\rfoot{\\thepage}

\\renewcommand{\\headrulewidth}{0pt}


\\usepackage{lmodern}
\\renewcommand{\\familydefault}{\\sfdefault}

\\title{Übersicht Daltonstunden}
\\date{\\today}

\\begin{document}
    \\maketitle

    \\newpage
    \\section{Mentor (grade)}
    \\textit{Day and lesson} \\\\

    \\textbf{Zugewiesene Schüler}
    \\begin{enumerate}
        \\item{Student 1}
        \\item{Student 2}
        \\item{Student 3}
        \\item{Student 4}
        \\item{Student 5}
        \\item{Student 6}
        \\item{Student 7}
        \\item{Student 8}
        \\item{Student 9}
        \\item{Student 10}
        \\item{Student 11}
        \\item{Student 12}
    \\end{enumerate}
    \\newpage


    \\begingroup

    \\begin{center}
        \\huge{Übersicht Daltonstunden Phase 1}
    \\end{center}

    \\footnotesize
    \\setlength{\\tabcolsep}{3pt}

    \\begin{longtable}{|l|c| c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width
    1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}c|c|c|c!{\\vrule width 1.2pt}}
        \\hline
        \\textbf{Name} & \\textbf{Pflstd.} & \\multicolumn{4}{l|}{\\textbf{LW 1}}& \\multicolumn{4}{l|}{\\textbf{LW 2}}& \\multicolumn{4}{l|}{\\textbf{LW 3}}& \\multicolumn{4}{l|}{\\textbf{LW 4}}& \\multicolumn{4}{l|}{\\textbf{LW
        5}}& \\multicolumn{4}{l|}{\\textbf{LW 6}}& \\multicolumn{4}{l|}{\\textbf{LW 7}}& \\multicolumn{4}{l|}{\\textbf{LW 8}}& \\multicolumn{4}{l|}{\\textbf{LW 9}}& \\multicolumn{4}{l|}{\\textbf{LW 10}} \\\\

        & & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue & FS & DS & V & ue  \\\\ \\hline
        \\endhead

        \\hline


        \\multirow{2}{2cm}{Surname, Name} & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & &  \\\\ \\cline{3-42}
        & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & &  \\\\ \\hline


        Surname, Name & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & &  \\\\ \\cline{3-42}
        & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & & &  \\\\ \\hline


    \\end{longtable}
    \\endgroup

    \\newpage

    ä ö ü ß -

\\end{document}
`