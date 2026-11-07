import {Project, ProjectID, ProjectOverview} from "../shared/types";


declare global {
    interface Window {
        electronAPI: {
            getProjects: () => Promise<ProjectOverview[]>,

            getProject: (project: ProjectID) => Promise<Project>,
            getStudents: (project: ProjectID) => Promise<Project>,
            getTeachers: (project: ProjectID) => Promise<Project>,
            getCourses: (project: ProjectID) => Promise<Project>,
            getMentorLessons: (project: ProjectID) => Promise<Project>,
        }
    }
}
