import {readFile} from "node:fs";


export const isMentorLesson = (courseName: string): boolean => {
    return /M(EF|Q1|Q2)(\s+\d+)?/.test(courseName); // TODO: Fix hardcoded
}

export const isRelevantGrade = (grade: string): boolean => {
    return grade == "EF" || grade == "Q1" || grade == "Q2" || grade == ".Dalton"; // TODO: fix hardcoded
}

export const getFile = async (path: string): Promise<string | undefined> => {
    return new Promise<string | undefined>(resolve => {
        readFile(path, (err, data) => {
            if (err) {
                if (err.code == "ENOENT") {
                    console.log("Did not find the file to import!");
                    resolve(undefined);
                    return;
                }
                console.error(`Error while reading file to import: ${err}`);
                resolve(undefined);
                return;
            }

            resolve(data.toString());
        });
    });
}
