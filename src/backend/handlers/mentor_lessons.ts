import {MentorLesson, ProjectID} from "../../shared/types";
import {getMentorLessonsOfProject} from "../application/projects";
import IpcMainEvent = Electron.IpcMainEvent;
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectMentorLessonsHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<MentorLesson[]> => {
    if (project == "") {
        return [];
    }
    return getMentorLessonsOfProject(project);
}