const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const getExePath = () => {
    const isPackaged = app.isPackaged;
    if(isPackaged) {
      const exePath = app.getPath('exe');
      if (process.platform === 'darwin') {
        // Go up three directories: .../Ultimate ST.app/Contents/MacOS -> .../Ultimate ST.app
        return path.resolve(exePath, '../../../../');
      } else {
        // On Windows and Linux, just use the directory of the executable
        return path.dirname(exePath);
      }
    } else {
      return path.resolve(process.cwd(), '../Stream-Tool'); // For development, return the parent directory of the current working directory
    }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({

    width: 890,
    height: 329,
    resizable: false,

    icon: path.join(__dirname, 'icon.png'),
    
    minWidth: 890,
    minHeight: 349,
    maxWidth: 890,
    maxHeight: 490,


    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    }
  });

  mainWindow.webContents.openDevTools(); 


  // we dont like menus
  mainWindow.removeMenu();



// mainWindow.setAlwaysOnTop(true);

  // load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools(); // --for debugging
  ipcMain.handle('get-app-path', () => app.getAppPath());
  ipcMain.handle('get-exe-dir', () => getExePath());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
