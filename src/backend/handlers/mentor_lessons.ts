import {Day, MentorLesson, MentorLessonID, ProjectID, TeacherID} from "../../shared/types";
import {
    createMentorLessonInProject, deleteMentorLesson,
    editMentorLessonInProject,
    getMentorLessonsOfProject
} from "../application/projects";
import {IpcMainInvokeEvent} from "electron";

export const getProjectMentorLessonsHandler = async (_event: IpcMainInvokeEvent, project: ProjectID): Promise<MentorLesson[]> => {
    if (project == "") {
        return [];
    }
    return getMentorLessonsOfProject(project);
}

export const createMentorLessonHandler = async (_event: IpcMainInvokeEvent, projectID: ProjectID, day: Day, lesson: number, teacherID: TeacherID): Promise<MentorLessonID | undefined> => {
    return createMentorLessonInProject(projectID, day, lesson, teacherID);
}

export const editMentorLessonHandler = async (_event: IpcMainInvokeEvent, project: ProjectID, mentorLesson: MentorLessonID, day?: Day, lesson?: number, teacher?: TeacherID): Promise<MentorLesson | undefined> =>{
    return editMentorLessonInProject(project, mentorLesson, day, lesson, teacher);
}

export const deleteMentorLessonHandler = (_event: IpcMainInvokeEvent, project: ProjectID, id: MentorLessonID): Promise<void | undefined> => {
    return deleteMentorLesson(project, id);
}

