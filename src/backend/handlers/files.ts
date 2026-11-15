import {queryUserForFilePath} from "../application/files";
import {IpcMainInvokeEvent} from "electron";

export const getFilePathFromUser = (_event: IpcMainInvokeEvent, title?: string): Promise<string | undefined> => {
    return queryUserForFilePath(title);
}
