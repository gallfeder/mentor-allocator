import {Teacher} from "../../shared/types";

export function getTeacherName(teacher: Teacher): string {
    const hasName: boolean = Boolean(teacher.name);
    const hasSurname: boolean = Boolean(teacher.surname);
    const hasShorthand: boolean = Boolean(teacher.shorthand);

    let namePart: string = "";

    if (hasName && hasSurname) {
        namePart = `${teacher.surname}, ${teacher.name}`;
    } else if (hasName) {
        namePart = teacher.name;
    } else if (hasSurname) {
        namePart = teacher.surname;
    }

    if (!namePart) {
        return hasShorthand ? `(${teacher.shorthand})` : "No teacher assigned...";
    }

    return hasShorthand ? `${namePart} (${teacher.shorthand})` : namePart;
}