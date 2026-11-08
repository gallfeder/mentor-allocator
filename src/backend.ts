import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {createProjectHandler, getProjectHandler, getProjectsHandler} from "./backend/handlers/projects";
import {createStudentHandler, getProjectStudentsHandler} from "./backend/handlers/students";
import {createTeacherHandler, getProjectTeachersHandler} from "./backend/handlers/teachers";
import {createCourseHandler, getCoursesHandler} from "./backend/handlers/courses";
import {createMentorLessonHandler, getProjectMentorLessonsHandler} from "./backend/handlers/mentor_lessons";

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
  console.log(__dirname)

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("dialog:getProjects", getProjectsHandler);

  ipcMain.handle("dialog:getProject", getProjectHandler);
  ipcMain.handle("dialog:getStudents", getProjectStudentsHandler);
  ipcMain.handle("dialog:getTeachers", getProjectTeachersHandler);
  ipcMain.handle("dialog:getCourses", getCoursesHandler);
  ipcMain.handle("dialog:getMentorLessons", getProjectMentorLessonsHandler);

  ipcMain.handle("dialog:createProject", createProjectHandler);
  ipcMain.handle("dialog:createCourse", createCourseHandler);
  ipcMain.handle("dialog:createMentorLesson", createMentorLessonHandler);
  ipcMain.handle("dialog:createStudent", createStudentHandler);
  ipcMain.handle("dialog:createTeacher", createTeacherHandler);

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
