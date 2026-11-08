import {Day, MentorLesson, MentorLessonID, ProjectID, TeacherID} from "../../shared/types";
import {
    createMentorLessonInProject,
    editMentorLessonInProject,
    getMentorLessonsOfProject
} from "../application/projects";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export const getProjectMentorLessonsHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<MentorLesson[]> => {
    if (project == "") {
        return [];
    }
    return getMentorLessonsOfProject(project);
}

export const createMentorLessonHandler = async (_event: IpcMainInvokeEvent, projectID: ProjectID, day: Day, lesson: number, teacherID: TeacherID): Promise<MentorLessonID> => {
    return createMentorLessonInProject(projectID, day, lesson, teacherID);
}

export const editMentorLessonHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> =>{
    return editMentorLessonInProject(project, mentorLesson, day, lesson, teacher);
}
