import {Project, Student} from "../../../shared/types";
import {DaltonPhase, PDFCheckGridExportParameters} from "../../../shared/export";
import {
    compileTeXToPath,
    extractMentorLessonData,
    getStudentName,
    makeTeXStringFromValues,
    MentorLessonData
} from "./tex_shared";


export const exportPDFCheckGrid = async (project: Project, {destination, grades, phasesBounds}: PDFCheckGridExportParameters): Promise<boolean> => {
    if (!phasesBounds) {
        return false;
    }

    const uppercaseGrades = grades && grades.size != 0 ? new Set<string>(Array.from(grades).map(g => g.toUpperCase())) : undefined;

    const lessons = extractMentorLessonData(project, uppercaseGrades);

    const exports = await Promise.all(lessons.map(lesson => {
        const str = getTeXString(lesson, phasesBounds);
        const dest = `${destination}${destination.charAt(destination.length) != "/" ? "/" : ""}Mentorenraster ${lesson.teacher.shorthand} ${lesson.grade}.pdf`

        return compileTeXToPath(dest, str);
    }));
    const hadNoIssues = exports.findIndex(res => !res) == -1;
    if (!hadNoIssues) {
        console.log(exports);
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

const getTeXString = (lesson: MentorLessonData, phases: DaltonPhase[]): string => {
    return `
\\documentclass[12pt, a4paper, landscape, ngerman]{scrreprt}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[ngerman]{babel}
\\usepackage[margin=1cm]{geometry}
\\usepackage{array}
\\usepackage{booktabs}
\\usepackage{longtable}

\\usepackage{lmodern}
\\renewcommand{\\familydefault}{\\sfdefault}

\\title{Übersicht Daltonstunden}
\\date{\\today}

\\begin{document}
	${makeTeXStringFromValues<DaltonPhase>(phases, (p, i) => getGridPage(p, i, lesson), "Keine Daltonphasen definiert!")}
\\end{document}
`
}

const getGridPage = (phase: DaltonPhase, currentPhaseIndex: number, lesson: MentorLessonData): string => {
    const numWeeks = Math.abs(phase[1] - phase[0]);

    return `
\\begingroup

\\begin{center}
\\huge{Übersicht Daltonstunden Phase ${currentPhaseIndex + 1}}
\\end{center}

\\footnotesize
\\setlength{\\tabcolsep}{3pt}

\\begin{longtable}{|l|c| ${repeatNTimes(numWeeks, "c|c|c|c!{\\vrule width 1.2pt}")}}
    \\hline
    \\textbf{Name} & \\textbf{Pflstd.} ${repeatNTimes(numWeeks, i => `& \\multicolumn{4}{l|}{\\textbf{LW ${phase[0] + 1 + i}}}`)} \\\\

    & ${repeatNTimes(numWeeks, "& FS & DS & V & ue ")} \\\\ \\hline
    \\endhead
    
    \\hline
    
    ${makeTeXStringFromValues<Student>(Array.from(lesson.students), s => studentEntry(s, numWeeks), studentEntry({grade: "", id: 0, mentorLessonId: 0, name: "Zugewiesen", surname: "Niemand"}, numWeeks))}
    
\\end{longtable}
\\endgroup

\\newpage
`
}

const studentEntry = (s: Student, weeks: number): string => {

    return `
${getStudentName(s)} & ${repeatNTimes(weeks, "& & & & ")} \\\\ \\cline{3-${weeks * 4 + 2}}
 & ${repeatNTimes(weeks, "& & & & ")} \\\\ \\hline
`
}
