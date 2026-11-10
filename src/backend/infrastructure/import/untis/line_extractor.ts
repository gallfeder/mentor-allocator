
export const extractValuesFromLine = (line: string): (string | number | undefined)[] => {
    if (line.length == 0) {
        return [];
    }
    const vals: (string | number | undefined)[] = [];
    const addSubstr = (substr: string) => {
        if (substr.length == 0) {
            vals.push(undefined);
            return;
        }
        if (substr.charAt(0) == '"') {
            vals.push(substr.slice(1, substr.length - 1));
            return;
        }
        vals.push(Number(substr));
    }

    let start = 0;
    let inQuotations = false;


    for (let i = 0; i < line.length; i++) {
        if (line.charAt(i) == '"') {
            inQuotations = !inQuotations;
            continue;
        }
        if (!(line.charAt(i) == "," || line.charAt(i) == "\n") || inQuotations) {
            continue;
        }
        if (line.charAt(i) == "\n") {
            addSubstr(line.slice(start, i));
            return vals;
        }
        addSubstr(line.slice(start, i));
        start = i + 1;
    }
    addSubstr(line.slice(start, line.length));

    return vals;
}
