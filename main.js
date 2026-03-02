const { app, BrowserWindow } = require('electron');
const path = require('path');
const server = require('./server.js');

const PORT = 8010;
let mainWindow;

function startServer() {
    // Set the correct public path for packaged apps
    if (app.isPackaged) {
        server.setPublicPath(path.join(process.resourcesPath, 'app', 'public'));
    }
    server.startServer();
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'public', 'logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
        show: false
    });

    // Wait for server to be ready, then load the app
    const loadApp = () => {
        mainWindow.loadURL(`http://localhost:${PORT}`);
    };

    // Give server a moment to start, then load
    setTimeout(loadApp, 500);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    startServer();
    createWindow();

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
