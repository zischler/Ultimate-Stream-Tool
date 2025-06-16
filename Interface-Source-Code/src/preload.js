// Expose only what you need to the renderer
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  fsReadFileSync: (filePath) => fs.readFileSync(filePath, 'utf8'),
  fsWriteFileSync: (filePath, data) => fs.writeFileSync(filePath, data),
  pathResolve: (...args) => path.resolve(...args),
  getEnv: (key) => process.env[key],
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getExeDir: () => ipcRenderer.invoke('get-exe-dir'),
});
