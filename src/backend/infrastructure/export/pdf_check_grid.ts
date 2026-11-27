import {Project, Student} from "../../../shared/types";
import {DaltonPhase, PDFCheckGridExportParameters} from "../../../shared/export";
import {
    compileTeXToPath,
    extractMentorLessonData,
    getStudentName,
    makeTeXStringFromValues,
    MentorLessonData
} from "./tex_shared";
import path from "node:path";
import {shell} from "electron";


export const exportPDFCheckGrid = async (project: Project, {destination, grades, phasesBounds, phasesNameOverwrite = "Phase", titleOverwrite, extraRowsPerStudent, teachersFilter, mentorLessonsFilter}: PDFCheckGridExportParameters): Promise<boolean> => {
    if (!phasesBounds) {
        return false;
    }
    const title = titleOverwrite ?? project.name;
    if (!extraRowsPerStudent || extraRowsPerStudent < 0) {
        extraRowsPerStudent = 0;
    }
    if (extraRowsPerStudent > 25) {
        extraRowsPerStudent = 25;
    }

    const uppercaseGrades = grades && grades.size != 0 ? new Set<string>(Array.from(grades).map(g => g.toUpperCase())) : undefined;

    const lessons = extractMentorLessonData(project, uppercaseGrades)
        .filter(ml => (!teachersFilter || teachersFilter.has(ml.teacher.id)) && (!mentorLessonsFilter || mentorLessonsFilter.has(ml.id)));

    const exports = await Promise.all(lessons.map(lesson => {
        const str = getTeXString(lesson, phasesBounds, phasesNameOverwrite, title, extraRowsPerStudent);
        const dest = path.join(destination, `Mentorenraster ${lesson.teacher.shorthand} ${lesson.grade}.pdf`);

        return compileTeXToPath(dest, str);
    }));
    const hadNoIssues = exports.findIndex(res => !res) == -1;
    if (!hadNoIssues) {
        console.log(exports);
    } else {
        shell.showItemInFolder(destination);
    }

    return hadNoIssues;
}


const repeatNTimes = (n: number, str: string | ((i: number) => string)): string => {
    let s = "";
    for (let i = 0; i < n; i++) {
        if (typeof str == "function") {
            s += str(i);
        } else {
            s += str;
        }
    }
    return s;
}

const getTeXString = (lesson: MentorLessonData, phases: DaltonPhase[], phaseName: string, projectTitle: string, extraRows: number): string => {
    return `
\\documentclass[12pt, a4paper, landscape, ngerman]{scrreprt}
\\usepackage[utf8]{inputenc}
\\usepackage[ngerman]{babel}
\\usepackage{fontenc}
\\usepackage[left=1cm,right=1cm]{geometry}
\\usepackage{array}
\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{multirow}
\\usepackage{fancyhdr}

\\pagestyle{fancy}

\\lfoot{${projectTitle}}
\\cfoot{${lesson.teacher.shorthand} - ${lesson.grade}}
\\rfoot{\\thepage}

\\renewcommand{\\headrulewidth}{0pt}

\\usepackage{lmodern}
\\renewcommand{\\familydefault}{\\sfdefault}

\\title{Übersicht Daltonstunden}
\\date{\\today}

\\newcolumntype{M}[1]{>{\\centering\\arraybackslash}m{#1}}
\\newcolumntype{L}[1]{>{\\raggedright\\arraybackslash}m{#1}}

\\newlength{\\colw}
\\setlength{\\colw}{0.35cm}

\\begin{document}
	${makeTeXStringFromValues<DaltonPhase>(phases, (p, i) => getGridPage(p, i, lesson, phaseName, extraRows), "Keine Daltonphasen definiert!")}
\\end{document}
`
}

const getGridPage = (phase: DaltonPhase, currentPhaseIndex: number, lesson: MentorLessonData, phaseName: string, extraRows: number): string => {
    const numWeeks = Math.abs(phase[1] - phase[0]);
    const thickLine = "!{\\vrule width 1.2pt}"
    return `
\\begingroup

\\huge{Übersicht Daltonstunden}
\\null\\hfill ${currentPhaseIndex + 1}. ${phaseName}

\\vspace{1cm}

\\footnotesize
\\setlength{\\tabcolsep}{3pt}

\\begin{longtable}{|p{2cm}|p{1cm}${thickLine} ${repeatNTimes(numWeeks, `p{\\colw}|p{\\colw}|p{\\colw}|p{\\colw}${thickLine}`)} p{\\colw}|p{\\colw}${thickLine}}
    \\hline
    \\textbf{Name} & \\textbf{Pflstd.} ${repeatNTimes(numWeeks, i => `& \\multicolumn{4}{l${thickLine}}{\\textbf{LW ${phase[0] + 1 + i}}}`)} & \\multicolumn{2}{l${thickLine}}{\\textbf{ges.}} \\\\

    & ${repeatNTimes(numWeeks, `& \\multicolumn{4}{l${thickLine}}{}`)} & \\multicolumn{2}{l${thickLine}}{\\textbf{}} \\\\
    & ${repeatNTimes(numWeeks, "& FS & DS & V & ue ")} & V & ue \\\\ \\hline
    \\endhead
    
    \\hline
    
    ${makeTeXStringFromValues<Student>(
        Array.from(lesson.students).sort((a,b) => getStudentName(a).localeCompare(getStudentName(b))),
        s => studentEntry(s, numWeeks, extraRows), 
        studentEntry({grade: "", id: 0, mentorLessonId: 0, name: "Zugewiesen", surname: "Niemand"}, numWeeks, extraRows)
    )}    
    
\\end{longtable}
\\endgroup

\\newpage
`
}

const studentEntry = (s: Student, weeks: number, extraRows: number): string => {
    if (extraRows == 0) {
        return `${getStudentName(s)} & ${repeatNTimes(weeks, "& & & & ")} & & \\\\ \\hline`
    }

    const cols = weeks * 4 + 2;
    const singleRow = `${repeatNTimes(weeks, "& & & & ")} & \\\\`;
    const innerRows = Array(extraRows + 1).fill(singleRow).join("\n\\hline\n");

    return `
${getStudentName(s)} & & \\multicolumn{${cols}}{@{}l@{}}{%
    {\\renewcommand{\\arraystretch}{1.25}%
    \\begin{tabular}[t]{*{${weeks}}{M{\\colw}|M{\\colw}|M{\\colw}|M{\\colw}!{\\vrule width 1.2pt}}M{\\colw}|M{\\colw}!{\\vrule width 1.2pt}}
        ${innerRows}
    \\end{tabular}}%
} \\\\ \\hline
`;
};