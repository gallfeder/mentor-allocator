import {Project, ProjectId, ProjectOverview} from "../shared/types";


declare global {
    interface Window {
        electronAPI: {
            getProjects: () => Promise<ProjectOverview[]>,

            getProject: (projectId: ProjectId) => Promise<Project>,
            getStudents: (projectId: ProjectId) => Promise<Project>,
            getTeachers: (projectId: ProjectId) => Promise<Project>,
            getCourses: (projectId: ProjectId) => Promise<Project>,
            getMentorLessons: (projectId: ProjectId) => Promise<Project>,
        }
    }
}
