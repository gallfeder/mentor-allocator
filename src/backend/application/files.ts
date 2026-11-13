
import { dialog } from "electron"
import { accessSync } from "node:fs";
import constants from "node:constants";

export const queryUserForFilePath = async (title = "Please select a file!"): Promise<string> => {
    const result = await dialog.showOpenDialog({
        title: title,
    });
    if (result.canceled) {
        console.info("User canceled selecting a file.");
        return "";
    }

    const path = result.filePaths[0];
    return checkFilePermissions(path) ? path : "";
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