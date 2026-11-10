import {extractValuesFromLine} from "./line_extractor";

export interface GPU001Entry {
    grade: string;
    teacherShorthand: string;
    courseName: string;
    day: number;
    lesson: number;
}


export const interpretAsGPU001 = (file: string): GPU001Entry[] => file.split("\n").map((line): GPU001Entry => {
    const v = extractValuesFromLine(line);
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
    const v = extractValuesFromLine(line);
    return {
        studentName:    (v[0] ?? "").toString(),
        courseName:     (v[2] ?? "").toString(),
        grade:          (v[4] ?? "").toString(),
        statistic:      (v[5] ?? "").toString(),
        studentNumber:  (v[6] ?? "").toString(),
    }
}).filter(e => e.courseName != "" && e.grade != "" && e.studentNumber != "");
