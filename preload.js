const { contextBridge, app, shell, ipcMain } = require('electron');
const osenv = require('osenv');
const fs = require('fs');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;
const srcDir = path.join(__dirname, 'src');



contextBridge.exposeInMainWorld('api',{
    srcPath: srcDir,
    testProp: osenv.user(),
    getHomeDir: () => osenv.home(),
    getDirContents: (dirname) =>{
        return fs.readdirSync(dirname, { withFileTypes: true });
    },
    pathJoin: (current,next) => path.join(current, next),
    appQuit: () => {
        ipcRenderer.send('closing');
    },
    mkDir: (current, dirname) =>{
        fs.mkdirSync(path.join(current, dirname));
    },
    mkFile: (current , fileName, fileType, text = '') =>{
        fs.appendFileSync(path.join(current,fileName+fileType), text);
    },
    openFile: (currentPath) =>{
        ipcRenderer.send('openFile', currentPath);
    },
    openDir: (currentPath , foldername) =>{
        ipcRenderer.send('openDir', path.join(currentPath, foldername));
    },
    openCmd: (currentPath) =>{
        ipcRenderer.send('openCmd', currentPath);
    },
    openWin: (currentPath) =>{
        ipcRenderer.send('openWin', currentPath);
    },
    addFavorite: (currentPath) =>{
        ipcRenderer.send('favorite', currentPath);
    },
    readFile: (path) =>{
        return fs.readFileSync(path, 'utf-8');
    },
    writeFile: (path, data) =>{
        fs.writeFileSync(path, data, 'utf8');
    },
    fileAccess: (path, elem) =>{
        fs.accessSync(path.join(path,elem), fs.constants.R_OK | fs.constants.W_OK | fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`Datei ist nicht lesbar: ${err}`);
                return false;
              } else {
                console.log(`Datei ist lesbar`);
                return true;
              }
          });
    },
    Notification: (title, text) =>{
        new Notification(title, {body: text})
    }
});