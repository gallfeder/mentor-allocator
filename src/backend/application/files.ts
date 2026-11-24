import {app, BrowserWindow, dialog} from "electron"
import {accessSync} from "node:fs";
import constants from "node:constants";

let mainWindow: BrowserWindow;

export const setMainWindow = (w: BrowserWindow) => {
    mainWindow = w;
}

export const queryUserForFilePath = async (title = "Please select a file!"): Promise<string | undefined> => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: title,
        defaultPath: app.getPath("home"),
    });
    if (result.canceled) {
        console.info("User canceled selecting a file.");
        return undefined;
    }

    const path = result.filePaths[0];
    return checkFilePermissions(path) ? path : undefined;
}

export const queryUserForDirectoryPath = async (title = "Please select a directory!"): Promise<string | undefined> => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: title,
        properties: ["openDirectory", "createDirectory"],
        defaultPath: app.getPath("home"),
    });
    if (result.canceled) {
        console.info("User canceled selecting a file.");
        return undefined;
    }

    const path = result.filePaths[0];
    return checkFilePermissions(path) ? path : undefined;
}

const checkFilePermissions = (path: string): boolean => {
    try {
        accessSync(path, constants.R_OK);
        accessSync(path, constants.W_OK);
        return true;
    } catch (e) {
        console.info(`Check for file permissions failed for ${path}: ${e}`);
        return false;
    }
}