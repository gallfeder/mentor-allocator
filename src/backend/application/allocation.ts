import {Course, CourseID, MentorLessonID, Project, StudentId, StudentID, TeacherID} from "../../shared/types";

interface StudentAllocation {
    student: StudentID
    allocation: MentorLessonID
}

interface ProposedMentorLessonAllocation {
    mentorLessonID: MentorLessonID;
    teacherID: TeacherID;
    studentIDs: StudentID[];
    untouchableAllocations: number;
}

export const getAutomaticAllocations = (project: Project): StudentAllocation[] => {
    const {studentTeachers, teacherStudents, unallocatedStudents, targetStudentsPerLesson, mentorLessons} = formatData(project);

    const getHighestPriorityMentorLesson = (): ProposedMentorLessonAllocation => {
        const priorities: {m: ProposedMentorLessonAllocation, priority: number}[] = [];
        for (const [, ml] of mentorLessons) {
            const students = (teacherStudents.get(ml.teacherID) ?? []).filter(s => unallocatedStudents.has(s));
            priorities.push({
                m: ml,
                priority: getAllocationPriority(
                    unallocatedStudents.size,
                    students.length,
                    targetStudentsPerLesson,
                    ml.untouchableAllocations + ml.studentIDs.length
                ),
            });
        }
        const highestPriority = priorities.reduce((highest, current) => highest.priority < current.priority ? current : highest);
        return highestPriority.m;
    }

    const canAllocateMoreStudents = (): boolean => {
        if (unallocatedStudents.size == 0) {
            return false;
        }
        for (const sID of unallocatedStudents) {
            const teachers = new Set<TeacherID>(studentTeachers.get(sID) ?? []);
            if (teachers.size == 0) {
                continue;
            }

            for (const [, ml] of mentorLessons) {
                if (ml.studentIDs.length + ml.untouchableAllocations < targetStudentsPerLesson && teachers.has(ml.teacherID)) {
                    return true;
                }
            }
        }
        return false;
    }

    const allocateStudentToLesson = (studentID: StudentId, mentorLesson: ProposedMentorLessonAllocation) => {
        mentorLesson.studentIDs.push(studentID);
        unallocatedStudents.delete(studentID);
    }

    while (canAllocateMoreStudents()) {
        const ml = getHighestPriorityMentorLesson();
        const allocatableStudents = (teacherStudents.get(ml.teacherID) ?? []).filter(s => unallocatedStudents.has(s));
        const studentID = allocatableStudents.shift();
        if (!studentID) {
            continue;
        }
        allocateStudentToLesson(studentID, ml);
    }

    const allocations: StudentAllocation[] = [];
    for (const [mlID,ml] of mentorLessons) {
        ml.studentIDs.forEach(sID => allocations.push({
            student: sID,
            allocation: mlID
        }));
    }
    return allocations;
}

export const getAllocationPriority = (unallocatedStudents: number, allocatable: number, studentsPerLesson: number, allocated: number) => {
    if (allocatable <= 0) {
        return 0;
    }
    return (unallocatedStudents / allocatable) * (studentsPerLesson - allocated);
};

const formatData = (project: Project) => {
    const mentorLessons = new Map<MentorLessonID, ProposedMentorLessonAllocation>(project.mentorLessons.map(m => [
        m.id,
        {
            mentorLessonID: m.id,
            teacherID: m.teacherId,
            studentIDs: [],
            untouchableAllocations: 0,
        }
    ]));
    const unallocatedStudents = new Set<StudentID>();

    for (const s of project.students) {
        if (s.mentorLessonId == -1) {
            unallocatedStudents.add(s.id);
            continue;
        }
        const allocatedTo = mentorLessons.get(s.mentorLessonId);
        if (!allocatedTo) {
            continue;
        }
        allocatedTo.untouchableAllocations++;
    }
    const targetStudentsPerLesson = Math.ceil(project.students.length / project.mentorLessons.length);
    const {studentTeachers, teacherStudents} = extractStudentDataFromCourses(project.courses, unallocatedStudents);

    return {
        mentorLessons,
        unallocatedStudents,
        targetStudentsPerLesson,
        studentTeachers,
        teacherStudents,
    };
}


interface StudentDataReturnType {
    studentCourses: Map<StudentID, CourseID[]>;
    courseStudents: Map<CourseID, StudentID[]>;
    
    studentTeachers: Map<StudentID, TeacherID[]>;
    teacherStudents: Map<TeacherID, StudentID[]>;
}

export const extractStudentDataFromCourses = (courses: Course[], students = new Set<StudentID>()): StudentDataReturnType => {
    const data: StudentDataReturnType = {
        studentCourses: new Map<StudentID, CourseID[]>(),
        courseStudents: new Map<CourseID, StudentID[]>(), 
        
        studentTeachers: new Map<StudentID, TeacherID[]>(), 
        teacherStudents: new Map<TeacherID, StudentID[]>(),
    }

    for (const course of courses) {
        if (course.students.length == 0) {
            continue;
        }

        for (const sID of course.students) {
            if (!students.has(sID)) {
                continue;
            }

            const sc = data.studentCourses.get(sID);
            if (!sc) {
                data.studentCourses.set(sID, [course.id]);
            } else {
                sc.push(course.id);
            }

            const c = data.courseStudents.get(course.id);
            if (!c) {
                data.courseStudents.set(course.id, [sID]);
            } else {
                c.push(sID);
            }

            const st = data.studentTeachers.get(sID);
            if (!st) {
                data.studentTeachers.set(sID, [course.teacher]);
            } else {
                st.push(course.teacher);
            }

            const t = data.teacherStudents.get(course.teacher);
            if (!t) {
                data.teacherStudents.set(course.teacher, [sID]);
            } else {
                t.push(sID);
            }
        }
    }
    return data;
}
