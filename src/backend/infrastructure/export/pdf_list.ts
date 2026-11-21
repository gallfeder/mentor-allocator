import {PDFListExportParameters} from "../../../shared/export";
import {Day, MentorLessonID, Project, Student, Teacher, TeacherID} from "../../../shared/types";
import {
    compileLaTeXToPath,
    getLessonDate,
    getStudentName,
    getTeacherName,
    makeLaTeXStringFromValues
} from "./latex_shared";


export const exportPDFList = async (project: Project, {destination, titleOverwrite, includeTitlePage = true, grades}: PDFListExportParameters): Promise<boolean> => {
    const uppercaseGrades = grades && grades.size != 0 ? new Set<string>(Array.from(grades).map(g => g.toUpperCase())) : undefined;

    const lessons = extractMentorLessonData(project, uppercaseGrades).sort((a, b) => {
        if (a.grade != b.grade) {
            return a.grade.localeCompare(b.grade)
        }
        return getTeacherName(a.teacher).localeCompare(getTeacherName(b.teacher));
    });

    const title = titleOverwrite ?? project.name;
    const str = getLaTeXString(title, includeTitlePage, lessons);

    const dest = `${destination}${destination.charAt(destination.length) != "/" ? "/" : ""}${title}.pdf`

    return compileLaTeXToPath(dest, str);
}

interface MentorLessonData {
    teacher: Teacher;
    grade: string;
    students: Set<Student>;
    day: Day;
    lesson: number;
}

const extractMentorLessonData = (project: Project, includeGrades?: Set<string>): MentorLessonData[] => {
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

const getLaTeXString = (title: string, titlePage: boolean, lessons: MentorLessonData[]): string => `
\\documentclass[12pt, a4paper, ngerman]{scrreprt}

\\usepackage[utf8]{inputenc}
\\usepackage[ngerman]{babel}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\renewcommand{\\familydefault}{\\sfdefault}

\\title{${title}}
\\date{\\today}

\\setcounter{secnumdepth}{-1}

\\begin{document}
${titlePage ? "\\maketitle" : ""}

${makeLaTeXStringFromValues<MentorLessonData>(lessons ?? [], getMentorLessonLaTeXString, "Es gibt keine relevanten Mentorenstunden!")}
\\end{document}
`



const getMentorLessonLaTeXString = (ml: MentorLessonData): string => {
    if (ml.students.size == 0) {
        return "";
    }

    return `
\\newpage
\\section{${getTeacherName(ml.teacher)} (${ml.grade})}
\\textit{${getLessonDate(ml.day, ml.lesson)}} \\\\

\\textbf{Zugewiesene Schüler}
\\begin{enumerate}
${makeLaTeXStringFromValues<Student>(Array.from(ml.students), (s): string => {
    const name = getStudentName(s);
    if (name.length == 0) {
        return "";
    }
    return `\\item{${name}}`;
}, "\\item{/}")}
\\end{enumerate}`
}
