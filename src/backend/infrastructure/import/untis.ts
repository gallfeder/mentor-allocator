import {extractValuesFromCSVLine} from "../../../shared/csv_line_extractor";
import {ImportedData} from "../../internal_types";
import {readFile} from "node:fs";
import {Course, Day, MentorLesson, MentorLessonID, Student, StudentID, Teacher} from "../../../shared/types";

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

const getFile = async (path: string): Promise<string | undefined> => {
    return new Promise<string | undefined>(resolve => {
        readFile(path, (err, data) => {
            if (err) {
                if (err.code == "ENOENT") {
                    console.log("Did not find the Untis file to import!");
                    resolve(undefined);
                    return;
                }
                console.error(`Error while reading Untis file to import: ${err}`);
                resolve(undefined);
                return;
            }

            resolve(data.toString());
        })
    });
}

const isMentorLesson = (courseName: string): boolean => {
    return courseName == "MQ2" || courseName == "MQ1" || courseName == "MEF";
}

export const importFromUntisFiles = async (pathGPU1: string, pathGPU15: string): Promise<ImportedData  | undefined> => {
    if (pathGPU1 == "" || pathGPU15 == "") {
        return undefined;
    }

    const [rawGPU1, rawGPU15] = await Promise.all([getFile(pathGPU1), getFile(pathGPU15)]);
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
        if (entry.grade != "EF" && entry.grade != "Q1" && entry.grade != "Q2" && entry.grade != ".Dalton") {
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
                teacher: teachers.get(entry.teacherShorthand)?.id ?? 0
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
            teacher: teachers.get(entry.teacherShorthand)?.id ?? 0
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
                mentorLesson: -1,
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
