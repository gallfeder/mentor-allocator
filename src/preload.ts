import contextBridge = Electron.contextBridge;


contextBridge.exposeInMainWorld("electronAPI", {

});