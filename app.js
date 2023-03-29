const electron = require('electron');
const path = require('path');
const { app, BrowserWindow ,Menu } = electron;
const srcDir = path.join(__dirname, 'src');
const isMac = process.platform === 'darwin';
const ctrlKey = isMac ? 'Command' : 'Ctrl';
const electronIpcMain = require('electron').ipcMain;
const { shell, MenuItem, Tray } = require('electron');
const exec = require('child_process').exec;

let goVsCode = false;
let mesVsCode = '';
let goCmd = false;
let mesCmd = '';
let goWin = false;
let mesWin = '';
let mesFav = '';

electronIpcMain.on('openDir', (event, message) => {
  goVsCode = true;
  mesVsCode = message;
})

electronIpcMain.on('openCmd',(event, message) =>{
  goCmd = true;
  mesCmd = message;
})

electronIpcMain.on('openWin',(event, message) =>{
  goWin = true;
  mesWin = message;
})

electronIpcMain.on('favorite',(event, message) =>{
  mesFav = message;
})

function createMenu (win){
  let template = [
    new MenuItem({
      label: 'In VS Code öffnen',
      click: () =>{
        if(mesVsCode == '.') goVsCode = false;
        if(goVsCode) exec('start cmd.exe /K "cd /D '+mesVsCode+' & code ."');
        goVsCode = false;
      }
    }),
    new MenuItem({
      label: 'cmd öffnen',
      click: () =>{
        if(goCmd) exec('start cmd.exe /K "cd /D '+mesCmd+' & color 02 & title HackerModus"');
        goCmd = false;
      }
    }),
    new MenuItem({
      label: 'Win Explorer öffnen',
      click: () =>{
        if(goWin) exec('start cmd.exe /K "cd /D '+mesWin+' & explorer . & exit "');
        goWin = false;
      }
    }),
    new MenuItem({
      label: "File erstellen",
      click: () =>{
        win.webContents.executeJavaScript("showCreateBox('File')");
      }
    }),
    new MenuItem({
      label: "Ordner erstellen",
      click: () =>{
        win.webContents.executeJavaScript("showCreateBox('Ordner')");
      }
    }),
    new MenuItem({
      label: "CodingOrdner erstellen",
      click: () =>{
        win.webContents.executeJavaScript("showCreateBox('CodingOrdner')");
      }
    }),
    new MenuItem({
      label: "Zu Favoriten hinzufügen",
      click: () =>{
        mesFav = JSON.stringify(mesFav);
        win.webContents.executeJavaScript("backPlusMenu('flex', 0.4, '-')");
        win.webContents.executeJavaScript("showCreateBox('Favoriten',"+mesFav+")");
      }
    }),
    {role: 'minimize'},
    {role:'quit'},
  ];
  Menu.buildFromTemplate(template).popup()
  };

const path1 = path.join(srcDir, "folder");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(path1, "coding_folder_blue.png"),
    resizable: false,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname,'preload.js'),
      nodeIntegration: true
    }
  });
  win.removeMenu();
  win.loadFile(path.join(srcDir, 'index.html'));
  win.webContents.on('context-menu', ()=>{
    createMenu(win);
  })
}

app.whenReady().then(() => {

    createWindow();
  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if(!isMac) app.quit()});
});

// Testing
electronIpcMain.on('closing', (event, message) => {
  app.quit();
})


electronIpcMain.on('openFile', (event, message) => {
  shell.beep();
  shell.openPath(message);
});

