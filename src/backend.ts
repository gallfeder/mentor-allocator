import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {
  createProjectHandler, deleteProjectHandler,
  editProjectNameHandler, exportProjectHandler,
  getProjectHandler,
  getProjectsHandler
} from "./backend/handlers/projects";
import {
  allocateStudentsHandler, automaticallyAllocateStudentsHandler,
  createStudentHandler, deleteStudentHandler,
  editStudentHandler,
  getProjectStudentsHandler
} from "./backend/handlers/students";
import {
  createTeacherHandler,
  deleteTeacherHandler,
  editTeacherHandler,
  getProjectTeachersHandler
} from "./backend/handlers/teachers";
import {
  createCourseHandler,
  deleteCourseHandler,
  editCourseHandler,
  getCoursesHandler
} from "./backend/handlers/courses";
import {
  createMentorLessonHandler, deleteMentorLessonHandler,
  editMentorLessonHandler,
  getProjectMentorLessonsHandler
} from "./backend/handlers/mentor_lessons";
import {getDirectoryPathFromUser, getFilePathFromUser} from "./backend/handlers/files";
import {initialiseTectonicCache} from "./backend/infrastructure/export/tex_shared";

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

  // mainWindow.webContents.openDevTools();
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

  ipcMain.handle("dialog:editProjectName", editProjectNameHandler);
  ipcMain.handle("dialog:editCourse", editCourseHandler);
  ipcMain.handle("dialog:editMentorLesson", editMentorLessonHandler);
  ipcMain.handle("dialog:editStudent", editStudentHandler);
  ipcMain.handle("dialog:editTeacher", editTeacherHandler);

  ipcMain.handle("dialog:allocateStudents", allocateStudentsHandler);
  ipcMain.handle("dialog:automaticallyAllocateStudents", automaticallyAllocateStudentsHandler)
  ipcMain.handle("dialog:getFilePathFromUser", getFilePathFromUser);
  ipcMain.handle("dialog:getDirectoryPathFromUser", getDirectoryPathFromUser);

  ipcMain.handle("dialog:deleteProject", deleteProjectHandler);
  ipcMain.handle("dialog:deleteStudent", deleteStudentHandler);
  ipcMain.handle("dialog:deleteTeacher", deleteTeacherHandler);
  ipcMain.handle("dialog:deleteCourse", deleteCourseHandler);
  ipcMain.handle("dialog:deleteMentorLesson", deleteMentorLessonHandler);

  ipcMain.handle("dialog:exportProject", exportProjectHandler);

  initialiseTectonicCache();

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
