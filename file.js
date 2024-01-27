const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Konfiguráljuk az ablakot
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false, // Keret eltávolítása
    titleBarStyle: 'hiddenInset', // Felső sáv elrejtése (titleBarStyle)
    icon: path.join(__dirname, 'icon.png') // A saját ikonod elérési útja
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
