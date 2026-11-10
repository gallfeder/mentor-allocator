import {Project, ProjectOverview} from "../../../../shared/types";

export interface InitProjectsPayload {
    projectOverview: ProjectOverview
}

export interface InitProjectPayload {
    project: Project;
}

export type MallocAction =
    { type: "INIT_PROJECTS", payload: InitProjectsPayload[] } |
    { type: "INIT_PROJECT", payload: InitProjectPayload }
