import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {AllocStudentsPayload} from "../MallocAction";
import {ProjectId, Student, StudentId} from "../../../../../shared/types";

const AllocStudentsAction = (state: MallocState, payload: AllocStudentsPayload): MallocState => {

    const stateProject: StateProject | undefined = state.projects.get(payload.projectId);
    if (!stateProject) {
        return { ...state };
    }

    const students: Map<StudentId, Student> = new Map(stateProject.students);
    for (const studentId of payload.students) {
        const student: Student | undefined = students.get(studentId);
        if (!student) {
            continue;
        }

        students.set(studentId, {
            ...student,
            mentorLessonId: payload.mentorLessonId,
        });
    }

    stateProject.students = students;

    const projects: Map<ProjectId, StateProject> = new Map(state.projects);
    projects.set(payload.projectId, stateProject);

    return {
        ...state,
        projects: projects
    }

}

export default AllocStudentsAction;