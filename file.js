const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Indítjuk az updater.js-t
  const updaterPath = path.join(__dirname, 'updater.js');
  const { exec } = require('child_process');
  const updaterProcess = exec(`node ${updaterPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Hiba az updater.js elindítása során: ${error}`);
      return;
    }
    console.log(`Az updater.js kimenete: ${stdout}`);
  });

  // Létrehozzuk az Electron ablakot
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Betöltjük az üdvözlő HTML-t
  mainWindow.loadFile('index.html');

  // Események figyelése, például az ablak bezárása
  mainWindow.on('closed', () => {
    mainWindow = null;
    // Az updater.js újraindítása az Electron alkalmazással együtt
    updaterProcess.kill();
    exec(`node ${__filename}`);
  });
}

// App események figyelése
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
