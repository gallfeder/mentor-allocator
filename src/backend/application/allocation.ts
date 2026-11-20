import {
    Course,
    MentorLessonID,
    Project,
    Student,
    StudentId,
    StudentID,
    TeacherID
} from "../../shared/types";
import {StudentAllocation} from "../internal_types";

interface ProposedMentorLessonAllocation {
    mentorLessonID: MentorLessonID;
    teacherID: TeacherID;
    studentIDs: StudentID[];
    grade: string;
    untouchableAllocations: number;
}

const size = (lesson: ProposedMentorLessonAllocation): number => {
    return lesson.untouchableAllocations + lesson.studentIDs.length;
}

export const getAutomaticAllocations = (project: Project): StudentAllocation[] => {
    const {studentTeachers, teacherStudents, unallocatedStudents, targetStudentsPerLesson, mentorLessons} = formatData(project);
    const students = new Map<StudentID, Student>(project.students.map(s => [s.id, s]));

    const getAllocations = (): StudentAllocation[] => {
        const allocations: StudentAllocation[] = [];
        for (const [mlID,ml] of mentorLessons) {
            ml.studentIDs.forEach(sID => allocations.push({
                student: sID,
                allocation: mlID
            }));
        }
        return allocations;
    }

    const makeAllocatableStudents = (ml: ProposedMentorLessonAllocation): StudentID[] => (teacherStudents.get(ml.teacherID) ?? []).filter(s => {
        if (!unallocatedStudents.has(s)) {
            return false;
        }
        const student = students.get(s);
        if (!student) {
            return false;
        }
        return student.grade == ml.grade
    });

    const getHighestPriorityMentorLesson = (): ProposedMentorLessonAllocation => {
        const priorities: {m: ProposedMentorLessonAllocation, priority: number}[] = [];
        for (const [,ml] of mentorLessons) {
            const students = makeAllocatableStudents(ml);
            priorities.push({
                m: ml,
                priority: getAllocationPriority(
                    unallocatedStudents.size,
                    students.length,
                    targetStudentsPerLesson,
                    size(ml)
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

            for (const [,ml] of mentorLessons) {
                if (ml.grade == students.get(sID)?.grade && size(ml) < targetStudentsPerLesson && teachers.has(ml.teacherID)) {
                    return true;
                }
            }
        }
        return false;
    }

    const allocateStudentToLesson = (studentID: StudentId, mentorLesson: ProposedMentorLessonAllocation) => {
        const s = students.get(studentID);
        if (!s || s.grade != mentorLesson.grade) {
            return;
        }
        mentorLesson.studentIDs.push(studentID);
        unallocatedStudents.delete(studentID);
    }

    while (canAllocateMoreStudents()) {
        const ml = getHighestPriorityMentorLesson();
        const allocatableStudentIDs = makeAllocatableStudents(ml);
        const studentID = allocatableStudentIDs.shift();
        if (!studentID) {
            continue;
        }
        allocateStudentToLesson(studentID, ml);
    }
    if (unallocatedStudents.size == 0) {
        return getAllocations();
    }

    optimiseAllocations(mentorLessons, studentTeachers, targetStudentsPerLesson);

    if (unallocatedStudents.size == 0) {
        return getAllocations();
    }

    const toAllocate = unallocatedStudents.size;
    for (let i = 0; i < toAllocate; i++) {
        const maxSize = targetStudentsPerLesson + i;

        for (const [,mentorLesson] of mentorLessons) {
            if (size(mentorLesson) > maxSize) {
                continue;
            }

            const students = teacherStudents.get(mentorLesson.teacherID);
            if (!students) {
                continue;
            }
            for (const student of students) {
                if (size(mentorLesson) > maxSize) {
                    break;
                }
                if (!unallocatedStudents.has(student)) {
                    continue;
                }

                allocateStudentToLesson(student, mentorLesson);
            }
        }
    }

    return getAllocations();
}

const optimiseAllocations = (mentorLessons: Map<MentorLessonID, ProposedMentorLessonAllocation>, studentTeachers: Map<StudentID, TeacherID[]>, targetStudents: number) => {
    const orderedLessons = Array.from(mentorLessons, ([,lesson]) => lesson).sort((a, b) => (a.untouchableAllocations + a.studentIDs.length) - (b.untouchableAllocations + b.studentIDs.length));


    for (let lessonIndex = 0; lessonIndex < orderedLessons.length; lessonIndex++) {
        const lesson = orderedLessons[lessonIndex];

        if (size(lesson) >= targetStudents) {
            continue;
        }

        for (let i = lessonIndex; i < orderedLessons.length; i++) {
            if (size(lesson) > targetStudents) {
                break;
            }
            if (orderedLessons[i].grade != lesson.grade) {
                continue;
            }

            for (const student of orderedLessons[i].studentIDs) {
                if (size(lesson) >= targetStudents) {
                    break;
                }

                const possibleTeachers = studentTeachers.get(student)
                if (!possibleTeachers || possibleTeachers.findIndex(e => e == lesson.teacherID) == -1) {
                    continue;
                }

                lesson.studentIDs.push(student);
                orderedLessons[i].studentIDs = orderedLessons[i].studentIDs.filter(id => id != student);
            }
        }
    }
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
            grade: m.grade,
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


    for (const student of unallocatedStudents) {
        const teacherIDs = studentTeachers.get(student);
        if (!teacherIDs || teacherIDs.length == 0) {
            unallocatedStudents.delete(student);
        }
    }

    return {
        mentorLessons,
        unallocatedStudents,
        targetStudentsPerLesson,
        studentTeachers,
        teacherStudents,
    };
}


interface StudentDataReturnType {
    studentTeachers: Map<StudentID, TeacherID[]>;
    teacherStudents: Map<TeacherID, StudentID[]>;
}

export const extractStudentDataFromCourses = (courses: Course[], students = new Set<StudentID>()): StudentDataReturnType => {
    const data: StudentDataReturnType = {
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
