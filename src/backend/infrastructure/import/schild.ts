import {ImportedData} from "../../internal_types";
import {extractValuesFromCSVLine} from "./csv_line_extractor";
import {SchILDImportParameters} from "../../../shared/import";
import {Course, MentorLesson, MentorLessonID, Student, StudentID, Teacher} from "../../../shared/types";
import {getFile, isMentorLesson, isRelevantGrade} from "./shared";

interface SchILDCourse {
    grade: string;
    teacherShorthand: string;
    courseName: string;
}

export const interpretSchILDCourses = (data: string, separator = "|"): SchILDCourse[] | undefined => {
    const lines = data.split("\n");
    if (lines.length < 2) {
        console.log("Could not interpret SchILD courses file due to a lack of lines!")
        return undefined;
    }
    const mapping = extractValuesFromCSVLine(lines[0], separator);

    const gradeIndex = mapping.findIndex(v => /\s?Jahrgang\s?/.test(v?.toString() ?? ""));
    const teacherIndex = mapping.findIndex(v => /\s?Kursleiter\s?/.test(v?.toString() ?? ""));
    const courseNameIndex = mapping.findIndex(v => /\s?KursBez\s?/.test(v?.toString() ?? ""));

    if (gradeIndex == -1 || teacherIndex == -1 || courseNameIndex == -1) {
        console.log("Could not interpret SchILD courses mapping!")
        return undefined;
    }

    const courses: SchILDCourse[] = [];

    for (let i = 1; i < lines.length; i++) {
        const vals = extractValuesFromCSVLine(lines[i], separator)
        courses.push({
            grade: (vals[gradeIndex] ?? "").toString(),
            teacherShorthand: (vals[teacherIndex] ?? "").toString(),
            courseName: (vals[courseNameIndex] ?? "").toString()
        });
    }

    return courses;
}

interface SchILDStudentCourses {
    name: string;
    surname: string;
    courses: Set<string>;
}

export const interpretSchILDStudentCourses = (data: string, separator = ";"): SchILDStudentCourses[] | undefined => {
    const lines = data.split("\n");
    if (lines.length < 2) {
        console.log("Could not interpret SchILD student courses file due to a lack of lines!")
        return undefined;
    }
    const mapping = extractValuesFromCSVLine(lines[0], separator);

    const nameIndex = mapping.findIndex(v => /\s?Vorname\s?/.test(v?.toString() ?? ""));
    const surnameIndex = mapping.findIndex(v => /\s?Nachname\s?/.test(v?.toString() ?? ""));
    const coursesIndices = new Set<number>(mapping.map((v, i) => /_Kurs\s?$/.test(v?.toString() ?? "") ? i : undefined).filter(i => i != undefined));

    if (nameIndex == -1 || surnameIndex == -1 || !coursesIndices || coursesIndices.size == 0) {
        console.log("Could not interpret SchILD student courses mapping!")
        return undefined;
    }

    const courses: SchILDStudentCourses[] = [];

    for (let i = 1; i < lines.length; i++) {
        const vals = extractValuesFromCSVLine(lines[i], separator)
        courses.push({
            name: (vals[nameIndex] ?? "").toString(),
            surname: (vals[surnameIndex] ?? "").toString(),
            courses: new Set<string>(vals.map((v, i) => coursesIndices.has(i) && v?.toString().length != 0 ? v?.toString() : undefined).filter(v => v != undefined))
        });
    }

    return courses;
}

export const importFromSchILDFiles = async ({pathToCourses, pathToStudentCourses, studentsGrade, coursesSeparatorOverwrite, studentCoursesSeparatorOverwrite}: SchILDImportParameters): Promise<ImportedData  | undefined> => {
    if (pathToCourses.length == 0 || pathToStudentCourses.length == 0) {
        console.log("Could not start SchILD import as the provided paths were empty!")
        return undefined;
    }
    studentsGrade = studentsGrade.toUpperCase();
    const [rawCourses, rawStudentCourses] = await Promise.all([getFile(pathToCourses), getFile(pathToStudentCourses)]);
    if (!rawCourses || !rawStudentCourses) {
        console.log("Failed reading data from files provided for SchILD import")
        return undefined;
    }

    const coursesData = interpretSchILDCourses(rawCourses, coursesSeparatorOverwrite);
    const studentCoursesData = interpretSchILDStudentCourses(rawStudentCourses, studentCoursesSeparatorOverwrite);
    if (!coursesData || !studentCoursesData) {
        console.log("Failed to interpret data for SchILD import")
        return undefined;
    }

    const teachers = new Map<string,Teacher>();
    const courses = new Map<string, Course>();
    const mentorLessons = new Map<MentorLessonID, MentorLesson>();
    const students = new Map<StudentID, Student>();

    let teacherIDs = 1, courseIDs = 1, mentorLessonIDs= 1, studentIDs = 1;

    for (const entry of coursesData) {
        entry.grade = entry.grade.toUpperCase();
        if (!isRelevantGrade(entry.grade)) {
            continue;
        }
        if (!teachers.has(entry.teacherShorthand)) {
            teachers.set(entry.teacherShorthand, {
                id: teacherIDs++,
                name: "",
                shorthand: entry.teacherShorthand,
                surname: entry.teacherShorthand
            });
        }
        if (isMentorLesson(entry.courseName)) {
            mentorLessons.set(mentorLessonIDs, {
                day: -1,
                grade: entry.courseName.slice(1,3),
                id: mentorLessonIDs++,
                lesson: -1,
                teacherId: teachers.get(entry.teacherShorthand)?.id ?? -1
            });
            continue;
        }
        courses.set(entry.grade + entry.courseName, {
            grade: entry.grade,
            id: courseIDs++,
            name: entry.courseName,
            students: [],
            teacher: teachers.get(entry.teacherShorthand)?.id ?? -1
        });
    }

    for (const studentChoice of studentCoursesData) {
        const sID: StudentID = studentIDs++;
        students.set(sID, {
            grade: studentsGrade,
            id: sID,
            mentorLessonId: -1,
            name: studentChoice.name,
            surname: studentChoice.surname
        });

        for (const courseName of studentChoice.courses) {
            courses.get(studentsGrade+courseName)?.students.push(sID);
        }
    }

    teachers.delete("");

    return {
        students: Array.from(students, (e) => e[1]),
        teacher: Array.from(teachers, (e) => e[1]),
        courses: Array.from(courses, (e) => e[1]),
        mentorLessons: Array.from(mentorLessons, (e) => e[1]),
    };
}

