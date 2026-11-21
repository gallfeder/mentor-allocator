import {Day, Student, Teacher} from "../../../shared/types";

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

export const makeLaTeXStringFromValues = <T>(values: T[], converterFn: (value: T) => string): string => {
    if (values.length == 0) {
        return "";
    }
    return values.map(val => converterFn(val)).reduce((previousValue, currentValue) => previousValue + "\n" + currentValue);
}
