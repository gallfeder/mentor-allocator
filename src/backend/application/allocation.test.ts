import {expect, describe, it} from "vitest";
import {Course, MentorLesson, Project, Student, Teacher, TeacherID} from "../../shared/types";
import {getAutomaticAllocations} from "./allocation";

const STUDENT_ALLOCATED_RATE = 5;
const defaultTeachers: Teacher[] = Array(3).fill(undefined).map((_, i) => {
    return {
        id: i + 1,
        shorthand: "DOE",
        name: "John",
        surname: "Doe"
    };
});
const defaultMentorLessons: MentorLesson[] = Array(3).fill(undefined).map((_, i) => {
    return {
        id: i + 1,
        day: 0,
        lesson: 3,
        teacherId: (i % defaultTeachers.length) + 1,
        grade: "EF"
    };
});
const defaultStudents: Student[] = Array(20).fill(undefined).map((_, i) => {
    return {
        id: i + 1,
        name: "Test",
        surname: "Test",
        grade: "EF",
        mentorLessonId: i % STUDENT_ALLOCATED_RATE == 0 ? ((i / STUDENT_ALLOCATED_RATE) % defaultMentorLessons.length) + 1 : -1
    };
});
const defaultCourses: Course[] = Array(10).fill(undefined).map((_, i) => {
    return {
        id: i + 1,
        grade: "EF",
        name: "Test Course",
        teacher: (i % defaultTeachers.length) + 1,
        students: Array(5).fill(-1).map((_, j) => ((j + (i * 5)) % defaultStudents.length) + 1)
    }
})
;
describe('automatic allocation', () => {
    it('should give no recommendations if no students are present', () => {
        const proj: Project = {
            name: "Test",
            id: "1234",
            dataVersion: 1,
            lastEdit: new Date(),
            mentorLessons: defaultMentorLessons,
            teachers: defaultTeachers,
            students: [],
            courses: defaultCourses.map(c => {
                return {
                    ...c,
                    students: []
                }
            })
        }
        const r = getAutomaticAllocations(proj);

        expect(r.length).toBe(0);
    });

    it('should give no recommendations if no mentor lessons are present', () => {
        const proj: Project = {
            name: "Test",
            id: "1234",
            dataVersion: 1,
            lastEdit: new Date(),
            mentorLessons: [],
            teachers: defaultTeachers,
            students: defaultStudents,
            courses: defaultCourses
        }
        const r = getAutomaticAllocations(proj);

        expect(r.length).toBe(0);
    });

    it('should give no recommendations if no unallocated students are present', () => {
        const proj: Project = {
            name: "Test",
            id: "1234",
            dataVersion: 1,
            lastEdit: new Date(),
            mentorLessons: defaultMentorLessons,
            teachers: defaultTeachers,
            students: defaultStudents.filter(s => s.mentorLessonId != -1),
            courses: defaultCourses
        }
        const r = getAutomaticAllocations(proj);

        expect(r.length).toBe(0);
    });
});

describe.for([
    {
        name: "Evenly spread project",
        id: "1234",
        dataVersion: 1,
        lastEdit: new Date(),
        mentorLessons: defaultMentorLessons,
        teachers: defaultTeachers,
        students: defaultStudents,
        courses: defaultCourses
    },
    {
        name: "Project with uncommon teacher",
        id: "1234",
        dataVersion: 1,
        lastEdit: new Date(),
        mentorLessons: defaultMentorLessons,
        teachers: [...defaultTeachers, {
            id: defaultTeachers.length,
            shorthand: "DOE",
            name: "John",
            surname: "Doe"
        }],
        students: defaultStudents,
        courses: [...defaultCourses, {
            id: defaultCourses.length,
            grade: "EF",
            name: "Test Course",
            teacher: defaultTeachers.length,
            students: Array(3).fill(-1).map((_, j) => ((j + 1 % defaultStudents.length) + 1))
        }]
    },
    {
        name: "Project with unallocatable student",
        id: "1234",
        dataVersion: 1,
        lastEdit: new Date(),
        mentorLessons: defaultMentorLessons,
        teachers: defaultTeachers,
        students: [...defaultStudents, {
            id: defaultStudents.length + 1,
            name: "unallocatable",
            surname: "Test",
            grade: "EF",
            mentorLessonId: -1
        }],
        courses: defaultCourses
    },
] as Project[])('allocate students', proj => {
    const mentors = new Set<TeacherID>(proj.mentorLessons.map(ml => ml.teacherId));
    const allocatableUnallocated = proj.students.filter(s => {
        if (s.mentorLessonId != -1) {
            return false;
        }
        const courseWithValidTeacher = proj.courses.findIndex(c => mentors.has(c.teacher) && c.students.findIndex(sID => sID == s.id) != -1);
        return courseWithValidTeacher != -1;
    });

    it('should allocate all unallocated, allocateable students', () => {
        const r = getAutomaticAllocations(proj);

        expect(r.length).toBe(allocatableUnallocated.length);

        for (const studentAllocation of r) {
            const index = allocatableUnallocated.findIndex(s => s.id == studentAllocation.student);
            expect(index == -1).toBe(false);
        }

        for (const student of allocatableUnallocated) {
            const index = r.findIndex(alloc => alloc.student == student.id);
            expect(index == -1).toBe(false);
        }
    });

    it('should allocate students only to teachers they have', () => {
        const r = getAutomaticAllocations(proj);

        for (const studentAllocation of r) {
            const teacher = proj.mentorLessons.find(ml => ml.id == studentAllocation.allocation)?.teacherId;
            if (!teacher) {
                continue;
            }
            const course = proj.courses.find(c => c.teacher == teacher && c.students.findIndex(sID => sID == studentAllocation.student) != -1);
            expect(course == undefined).toBe(false);
        }
    });
});