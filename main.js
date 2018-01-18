const path = require('path');
const url = require('url');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;

let mainWindow = null;

function initialize () {
    app.on('ready', function () {
        createWindow();
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });
}

function createWindow () {
    const windowOptions = {
        width: 1280,
        height: 840,
        title: app.getName(),
        resizable: false,
        webPreferences: {
            webSecurity: false
        }
    };

    if (process.platform === 'linux') {
        windowOptions.icon = path.join(__dirname, '/front/assets/app-icon.svg');
    }

    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(url.format({
        protocol: 'file',
        slashes: true,
        pathname: path.join(__dirname, 'docs/index.html')
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

initialize();

