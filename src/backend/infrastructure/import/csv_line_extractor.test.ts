import {extractValuesFromCSVLine} from "./csv_line_extractor";
import {expect, describe, it} from "vitest";


describe("Testing extracting values from line", () => {
    it('should deal with empty string correctly', () => {
        const v = extractValuesFromCSVLine("\n");

        expect(v.length).toBe(0);
    });

    it('should deal with string containing only a space correctly', () => {
        const v = extractValuesFromCSVLine(" ");

        expect(v.length).toBe(0);
    });

    it('should deal with string without values correctly', () => {
        const v = extractValuesFromCSVLine(",");
        expect(v.length).toBe(2);
        expect(v[0]).toBe(undefined);
        expect(v[1]).toBe(undefined);
    });

    it('should correctly interpret numbers', () => {
        const v = extractValuesFromCSVLine("1,4");

        expect(v.includes(1)).toBe(true);
        expect(v.includes(4)).toBe(true);
        expect(v.includes(2)).toBe(false);

        expect(v.includes("")).toBe(false);
        expect(v.includes("1")).toBe(false);
        expect(v.includes(",")).toBe(false);

        expect(v.length).toBe(2);
    });

    it('should continue the initial order', () => {
        const v = extractValuesFromCSVLine("1,3")

        expect(v[0]).toBe(1);
        expect(v[1]).toBe(3);
        expect(v.length).toBe(2);
    });

    it('should interpret strings correctly', () => {
        const v = extractValuesFromCSVLine(`1,"two",3`);

        expect(v[0]).toBe(1);
        expect(v[1]).toBe("two");
        expect(v[2]).toBe(3);
        expect(v.length).toBe(3);
    });

    it('should handle strings at the start and end', () => {
        const v = extractValuesFromCSVLine(`"Test Name",1,"TST"`);

        expect(v[0]).toBe("Test Name");
        expect(v[1]).toBe(1);
        expect(v[2]).toBe("TST");
        expect(v.length).toBe(3);
    });

    it('should allow colons within a string', () => {
        const v = extractValuesFromCSVLine(`"Name, Test"`);

        expect(v[0]).toBe("Name, Test");
        expect(v.length).toBe(1);
    });

    it('should interpret line with only quotation mark as empty', () => {
        const v = extractValuesFromCSVLine(`"`);
        //expect(v[0]).toBe(" ");
        expect(v.length).toBe(1);
        expect(v[0]).toBe("");
    });

    it('should extract colon in string', () => {
        const v = extractValuesFromCSVLine(`","`);
        expect(v.length).toBe(1);
        expect(v[0]).toBe(",");
    });

    it('should handle \\n correctly', () => {
        const v = extractValuesFromCSVLine(`"test\n","test2"\n`);
        expect(v.length).toBe(2);
        expect(v[0]).toBe("test\n");
        expect(v[1]).toBe("test2");
    });

    it('should handle \\n and colon correctly', () => {
        const v = extractValuesFromCSVLine(`"test\n","test2"\n,`);
        expect(v.length).toBe(2);
        expect(v[0]).toBe("test\n");
        expect(v[1]).toBe("test2");
    });

    it('should handle multiple colons without values in between correctly', () => {
        const v = extractValuesFromCSVLine("1,2,,,,6,")
        expect(v.length).toBe(7);
        expect(v[0]).toBe(1);
        expect(v[1]).toBe(2);
        expect(v[2]).toBe(undefined);
        expect(v[3]).toBe(undefined);
        expect(v[4]).toBe(undefined);
        expect(v[5]).toBe(6);
    });

    it('should handle line without colon correctly', () => {
        const v = extractValuesFromCSVLine(`"test"`);
        expect(v.length).toBe(1);
        expect(v[0]).toBe("test");
    });

    it('should handle line with colon at the end correctly', () => {
        const v = extractValuesFromCSVLine(`"test",`);
        expect(v.length).toBe(2);
        expect(v[0]).toBe("test");
        expect(v[1]).toBe(undefined);
    });

    it('should handle custom separator correctly', () => {
        const v = extractValuesFromCSVLine(`"test|"|"test2"\n`, "|");
        expect(v.length).toBe(2);
        expect(v[0]).toBe("test|");
        expect(v[1]).toBe("test2");
    });

    it('should handle custom string deliminator correctly', () => {
        const v = extractValuesFromCSVLine(`"1",'test2','"Test"'`, ",", "'");
        expect(v.length).toBe(3);
        expect(v[0]).toBe('"1"');
        expect(v[1]).toBe("test2");
        expect(v[2]).toBe('"Test"');
    });
    it('should handle both custom separator and string deliminator correctly', () => {
        const v = extractValuesFromCSVLine(`"1"|'test2'|'"Test"'`, "|", "'");
        expect(v.length).toBe(3);
        expect(v[0]).toBe('"1"');
        expect(v[1]).toBe("test2");
        expect(v[2]).toBe('"Test"');
    });

    it('should reject if separator and string deliminator are the same', () => {
        const v = extractValuesFromCSVLine(`"test","test2"`, ",", ",");
        expect(v.length).toBe(0);
    });

    it('should interpret non-delimited strings as strings', () => {
        const v = extractValuesFromCSVLine(`KursBez|Klasse|Jahr|Abschnitt|Jahrgang|Fach|Kursart|Wochenstd.|Wochenstd. KL|Kursleiter|Epochenunterricht|Schulnr|Schienen`, "|");
        expect(v.length).toBe(13);
        ["KursBez", "Klasse", "Jahr", "Abschnitt", "Jahrgang", "Fach", "Kursart", "Wochenstd.", "Wochenstd. KL", "Kursleiter", "Epochenunterricht", "Schulnr", "Schienen"].forEach((r, i) => {
            expect(v[i]).toBe(r);
        });
    });

    it('should handle German special characters correctly', () => {
        const v = extractValuesFromCSVLine(`"test"|"test2"|"Straße"|"abcdefß"|"äöpß-"`, "|");
        expect(v.length).toBe(5);
        expect(v[0]).toBe("test");
        expect(v[1]).toBe("test2");
        expect(v[2]).toBe("Straße");
        expect(v[3]).toBe("abcdefß");
        expect(v[4]).toBe("äöpß-");
    });

});