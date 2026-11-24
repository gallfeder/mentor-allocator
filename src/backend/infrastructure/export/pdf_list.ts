import {PDFListExportParameters} from "../../../shared/export";
import {Project, Student} from "../../../shared/types";
import {
    compileTeXToPath, extractMentorLessonData,
    getLessonDate,
    getStudentName,
    getTeacherName,
    makeTeXStringFromValues, MentorLessonData
} from "./tex_shared";
import path from "node:path";
import {shell} from "electron";


export const exportPDFList = async (project: Project, {destination, titleOverwrite, includeTitlePage = true, grades}: PDFListExportParameters): Promise<boolean> => {
    const uppercaseGrades = grades && grades.size != 0 ? new Set<string>(Array.from(grades).map(g => g.toUpperCase())) : undefined;

    const lessons = extractMentorLessonData(project, uppercaseGrades).sort((a, b) => {
        if (a.grade != b.grade) {
            return a.grade.localeCompare(b.grade)
        }
        return getTeacherName(a.teacher).localeCompare(getTeacherName(b.teacher));
    });

    const title = titleOverwrite ?? project.name;
    const str = getTeXString(title, includeTitlePage, lessons);

    const dest = path.join(destination, `${title}.pdf`);


    const ok = await compileTeXToPath(dest, str);
    if (ok) {
        shell.showItemInFolder(dest);
    }
    return ok;
}

const getTeXString = (title: string, titlePage: boolean, lessons: MentorLessonData[]): string => `
\\documentclass[12pt, a4paper, ngerman]{scrreprt}

\\usepackage[utf8]{inputenc}
\\usepackage[ngerman]{babel}
\\usepackage{fontenc}
\\usepackage{lmodern}
\\renewcommand{\\familydefault}{\\sfdefault}

\\title{${title}}
\\date{\\today}

\\setcounter{secnumdepth}{-1}

\\begin{document}
${titlePage ? "\\maketitle" : ""}

${makeTeXStringFromValues<MentorLessonData>(lessons ?? [], getMentorLessonTeXString, "Es gibt keine relevanten Mentorenstunden!")}
\\end{document}
`



const getMentorLessonTeXString = (ml: MentorLessonData): string => {
    if (ml.students.size == 0) {
        return "";
    }

    return `
\\newpage
\\section{${getTeacherName(ml.teacher)} (${ml.grade})}
\\textit{${getLessonDate(ml.day, ml.lesson)}} \\\\

\\textbf{Zugewiesene Schüler}
\\begin{enumerate}
${makeTeXStringFromValues<Student>(Array.from(ml.students), (s): string => {
    const name = getStudentName(s);
    if (name.length == 0) {
        return "";
    }
    return `\\item{${name}}`;
}, "\\item{/}")}
\\end{enumerate}`
}
