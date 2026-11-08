import { ProjectId } from "../../../../shared/types";

export interface InitProjectPayload {
    projectId: ProjectId;
    projectName: string;
}

export type MallocAction =
    { type: "INIT_PROJECTS", payload: InitProjectPayload[] }
