const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  // Eltávolítjuk az alapértelmezett menüt
  Menu.setApplicationMenu(null);

  // Konfiguráljuk az ablakot
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: true, // Ablakkeret bekapcsolása
    icon: path.join(__dirname, 'your-icon.png') // A saját ikonod elérési útja
  });

  // Betöltjük az üdvözlő HTML-t
  mainWindow.loadFile('index.html');

  // Események figyelése, például az ablak bezárása
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App események figyelése
app.on('ready', () => {
  createWindow();

  // Az updater.js fájl elérési útja
  const updaterPath = path.join(__dirname, 'updater.js');

  // Indítjuk az updater.js-t
  const updaterProcess = exec(`node ${updaterPath}`, (error) => {
    if (error) {
      console.error(`Hiba az updater.js elindítása során: ${error}`);
    }
  });

  // Figyeljük az updater.js kimenetét
  updaterProcess.stdout.on('data', (data) => {
    console.log(`Updater.js kimenet: ${data}`);
  });

  updaterProcess.stderr.on('data', (data) => {
    console.error(`Updater.js hiba: ${data}`);
  });

  updaterProcess.on('close', (code) => {
    console.log(`Updater.js leállt a kóddal: ${code}`);
  });
});

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
