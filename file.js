const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Indítjuk az előző Node.js kódot
  const { exec } = require('child_process');
  exec('node update.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Hiba az előző kód elindítása során: ${error}`);
      return;
    }
    console.log(`Az előző kód kimenete: ${stdout}`);
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
