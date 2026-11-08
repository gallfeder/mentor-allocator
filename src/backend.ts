import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {getProjectHandler, getProjectsHandler} from "./backend/handlers/projects";
import {getProjectStudentsHandler} from "./backend/handlers/students";
import {getProjectTeachersHandler} from "./backend/handlers/teachers";
import {getProjectCoursesHandler} from "./backend/handlers/courses";
import {getProjectMentorLessonsHandler} from "./backend/handlers/mentor_lessons";

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("dialog:getProjects", getProjectsHandler)

  ipcMain.handle("dialog:getProject", getProjectHandler)
  ipcMain.handle("dialog:getStudents", getProjectStudentsHandler)
  ipcMain.handle("dialog:getTeachers", getProjectTeachersHandler)
  ipcMain.handle("dialog:getCourses", getProjectCoursesHandler)
  ipcMain.handle("dialog:getMentorLessons", getProjectMentorLessonsHandler)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
