import {MallocState, StateProject} from "../../../../Models/States/MallocState";
import {SetStudentsPayload} from "../MallocAction";
import {ProjectId, Student, StudentId} from "../../../../../shared/types";

const setStudentsAction = (state: MallocState, payload: SetStudentsPayload): MallocState => {

    const projects = new Map<ProjectId, StateProject>(state.projects);
    const stateProject: StateProject | undefined = projects.get(payload.projectId);
    if (!stateProject) {
        return { ...state };
    }

    const students = new Map<StudentId, Student>();
    for (const student of payload.students) {
        students.set(student.id, student);
    }

    stateProject.students = students;
    projects.set(payload.projectId, stateProject);

    return {
        ...state,
        projects: projects
    }

}

export default setStudentsAction;