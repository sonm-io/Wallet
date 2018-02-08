const path = require('path');
const url = require('url');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

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
        title: app.getName(),
        //resizable: true,
        width: 1280,
        height: 840,
        minWidth: 1280,
        minHeight: 840,
        maxWidth: 1280,
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

    // Create the Application's main menu
    const template = [{
        label: 'Electron',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            },
        ]
    },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Copy',
                    accelerator: 'Command+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: function() { mainWindow.reload(); }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+Command+I',
                    click: function() { mainWindow.toggleDevTools(); }
                },
            ]
        },
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

initialize();

