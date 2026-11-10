import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import { Course, MentorLesson, ProjectId, Student, Teacher } from "../../../../../shared/types";
import {InitProjectPayload} from "../MallocAction";

const initProjectAction = (state: MallocState, payload: InitProjectPayload): MallocState => {

    const newProjects: Map<ProjectId, StateProject> = state.projects;

    newProjects.set(payload.project.id, {
        id: payload.project.id,
        name: payload.project.name,
        lastEdit: payload.project.lastEdit,
        dataVersion: payload.project.dataVersion,
        students: new Map(payload.project.students.map((student: Student) => [student.id, student])),
        courses: new Map(payload.project.courses.map((course: Course) => [course.id, course])),
        teachers: new Map(payload.project.teachers.map((teacher: Teacher) => [teacher.id, teacher])),
        mentorLessons: new Map(payload.project.mentorLessons.map((mentorLesson: MentorLesson) => [mentorLesson.id, mentorLesson]))
    });

    return {
        ...state,
        projects: newProjects
    }

}

export default initProjectAction;