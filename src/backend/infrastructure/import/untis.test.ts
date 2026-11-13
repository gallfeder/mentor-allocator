import {describe, expect, it} from "vitest";
import {GPU001Entry, GPU015Entry, interpretAsGPU001, interpretAsGPU015} from "./untis";


describe('GPU001 interpreted correctly', () => {
    const isSame = (gpu: GPU001Entry, exp: GPU001Entry): void => {
        expect(gpu.grade).toBe(exp.grade);
        expect(gpu.teacherShorthand).toBe(exp.teacherShorthand);
        expect(gpu.courseName).toBe(exp.courseName);
        expect(gpu.day).toBe(exp.day);
        expect(gpu.lesson).toBe(exp.lesson);
    }

    it('should interpret a line correctly', () => {
        const f = `1,"Q2","TST","Ex L1","123",1,2,,`;
        const gpu = interpretAsGPU001(f);

        expect(gpu.length).toBe(1);

        isSame(gpu[0], {
            courseName: "Ex L1",
            day: 1,
            grade: "Q2",
            lesson: 2,
            teacherShorthand: "TST"
        });
    });

    it('should interpret multiple lines correctly', () => {
        const f = `1,"Q2","TST","Ex L1","123",1,2,,\n2,"Q2","TTS","Ex L2","124",4,1,,`;
        const gpu = interpretAsGPU001(f);

        expect(gpu.length).toBe(2);

        isSame(gpu[0], {
            courseName: "Ex L1",
            day: 1,
            grade: "Q2",
            lesson: 2,
            teacherShorthand: "TST"
        });
        isSame(gpu[1], {
            courseName: "Ex L2",
            day: 4,
            grade: "Q2",
            lesson: 1,
            teacherShorthand: "TTS"
        });
    });

    it('should reject a line with missing important data', () => {
        const f = `1,"Q2","","Ex L1","123",1,2,,`;
        const gpu = interpretAsGPU001(f);

        expect(gpu.length).toBe(0);
    });

    it('should only filter out invalid lines', () => {
        const f = `1,"Q2","TST","Ex L1","123",1,2,,\n1,"Q2","","Ex L1","123",1,2,,`;
        const gpu = interpretAsGPU001(f);

        expect(gpu.length).toBe(1);

        isSame(gpu[0], {
            courseName: "Ex L1",
            day: 1,
            grade: "Q2",
            lesson: 2,
            teacherShorthand: "TST"
        });
    });
});




describe('GPU015 interpreted correctly', () => {
    const isSame = (gpu: GPU015Entry, exp: GPU015Entry) => {
        expect(gpu.studentName).toBe(exp.studentName);
        expect(gpu.courseName).toBe(exp.courseName);
        expect(gpu.grade).toBe(exp.grade);
        expect(gpu.statistic).toBe(exp.statistic);
        expect(gpu.studentNumber).toBe(exp.studentNumber);
    }

    it('should interpret a line correctly', () => {
        const f = `"Example_Exa_19700101",1,"Ex L1",,"Q2","1","1234",,,"1~2~1","Ex L1~Ex L2",,"1~1",`;
        const gpu = interpretAsGPU015(f);

        expect(gpu.length).toBe(1);
        isSame(gpu[0], {
            studentName: "Example_Exa_19700101",
            studentNumber: "1234",
            courseName: "Ex L1",
            grade: "Q2",
            statistic: "1",
        });
    });

    it('should interpret multiple lines correctly', () => {
        const f = `"Example_Exa_19700101",1,"Ex L1",,"Q2","1","1234",,,"1~2~1","Ex L1~Ex L2",,"1~1",\n"Example_Exa_19700101",263,"Ex L2",,"Q2","2","1234",,,"1~2~1","Ex L1~Ex L2",,"1~1",\n`;
        const gpu = interpretAsGPU015(f);

        expect(gpu.length).toBe(2);
        isSame(gpu[0], {
            studentName: "Example_Exa_19700101",
            studentNumber: "1234",
            courseName: "Ex L1",
            grade: "Q2",
            statistic: "1",
        });
        isSame(gpu[1], {
            studentName: "Example_Exa_19700101",
            studentNumber: "1234",
            courseName: "Ex L2",
            grade: "Q2",
            statistic: "2",
        });
    });

    it('should reject a line with missing important data', () => {
        const f = `"Example_Exa_19700101",,,,"Q2","1","1234",,,"1~2~1","Ex L1~Ex L2",,"1~1",`;
        const gpu = interpretAsGPU015(f);

        expect(gpu.length).toBe(0);
    });

    it('should should only filter out invalid lines', () => {
        const f = `"Example_Exa_19700101",,,,"Q2","1","1234",,,"1~2~1","Ex L1~Ex L2",,"1~1",\n"Example_Exa_19700101",1,"Ex L1",,"Q2","1","1234",,,"1~2~1","Ex L1~Ex L2",,"1~1",\n\n\n`;
        const gpu = interpretAsGPU015(f);

        expect(gpu.length).toBe(1);
        isSame(gpu[0], {
            studentName: "Example_Exa_19700101",
            studentNumber: "1234",
            courseName: "Ex L1",
            grade: "Q2",
            statistic: "1",
        });
    });
});