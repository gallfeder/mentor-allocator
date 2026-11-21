import {extractValuesFromCSVLine} from "./csv_line_extractor";
import {ImportedData} from "../../internal_types";
import {Course, Day, MentorLesson, MentorLessonID, Student, StudentID, Teacher} from "../../../shared/types";
import {UntisImportParameters} from "../../../shared/import";
import {getFile, isMentorLesson, isRelevantGrade} from "./shared";

export interface GPU001Entry {
    grade: string;
    teacherShorthand: string;
    courseName: string;
    day: number;
    lesson: number;
}


export const interpretAsGPU001 = (file: string): GPU001Entry[] => file.split("\n").map((line): GPU001Entry => {
    const v = extractValuesFromCSVLine(line, ",", '"');
    return {
        grade:              (v[1] ?? "").toString(),
        teacherShorthand:   (v[2] ?? "").toString(),
        courseName:         (v[3] ?? "").toString(),
        day:                Number(v[5]),
        lesson:             Number(v[6]),
    }
}).filter(e => e.grade != "" && e.teacherShorthand != "" && e.courseName != "");

export interface GPU015Entry {
    studentName: string;
    courseName: string;
    grade: string;
    statistic: string;
    studentNumber: string;
}


export const interpretAsGPU015 = (file: string): GPU015Entry[] => file.split("\n").map((line): GPU015Entry => {
    const v = extractValuesFromCSVLine(line, ",", '"');
    return {
        studentName:    (v[0] ?? "").toString(),
        courseName:     (v[2] ?? "").toString(),
        grade:          (v[4] ?? "").toString(),
        statistic:      (v[5] ?? "").toString(),
        studentNumber:  (v[6] ?? "").toString(),
    }
}).filter(e => e.courseName != "" && e.grade != "" && e.studentNumber != "");

export const importFromUntisFiles = async ({pathToGPU001, pathToGPU015}: UntisImportParameters): Promise<ImportedData  | undefined> => {
    if (pathToGPU001 == "" || pathToGPU015 == "") {
        return undefined;
    }

    const [rawGPU1, rawGPU15] = await Promise.all([getFile(pathToGPU001), getFile(pathToGPU015)]);
    if (!rawGPU1 || !rawGPU15) {
        return undefined;
    }
    const gpu1 = interpretAsGPU001(rawGPU1);
    const gpu15 = interpretAsGPU015(rawGPU15);

    const teachers = new Map<string,Teacher>();
    const courses = new Map<string, Course>();
    const mentorLessons = new Map<MentorLessonID, MentorLesson>();
    const students = new Map<StudentID, Student>();

    let teacherIDs = 1, courseIDs = 1, mentorLessonIDs= 1;

    for (const entry of gpu1) {
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
                day: (entry.day - 1) as Day,
                grade: entry.courseName.slice(1,3),
                id: mentorLessonIDs++,
                lesson: entry.lesson,
                teacherId: teachers.get(entry.teacherShorthand)?.id ?? -1
            });
            continue;
        }
        if (entry.grade == ".Dalton") {
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

    for (const courseChoice of gpu15) {
        if (isNaN(Number(courseChoice.studentNumber))) {
            continue;
        }
        const sID: StudentID = Number(courseChoice.studentNumber);
        if (!students.has(sID)) {
            const [surName, firstName] = courseChoice.studentName.split("_");
            students.set(sID, {
                grade: courseChoice.grade,
                id: sID,
                mentorLessonId: -1,
                name: firstName,
                surname: surName

            });
        }
        courses.get(courseChoice.grade+courseChoice.courseName)?.students.push(sID);
    }

    return {
        students: Array.from(students, (e) => e[1]),
        teacher: Array.from(teachers, (e) => e[1]),
        courses: Array.from(courses, (e) => e[1]),
        mentorLessons: Array.from(mentorLessons, (e) => e[1]),
    };
}
