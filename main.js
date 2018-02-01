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
    var template = [{
        label: 'Electron',
        submenu: [
            {
                label: 'About Electron',
                selector: 'orderFrontStandardAboutPanel:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide Electron',
                accelerator: 'Command+H',
                selector: 'hide:'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:'
            },
            {
                label: 'Show All',
                selector: 'unhideAllApplications:'
            },
            {
                type: 'separator'
            },
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
                    label: 'Undo',
                    accelerator: 'Command+Z',
                    selector: 'undo:'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'Command+X',
                    selector: 'cut:'
                },
                {
                    label: 'Copy',
                    accelerator: 'Command+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+Command+I',
                    click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
                },
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    selector: 'arrangeInFront:'
                },
            ]
        },
        {
            label: 'Help',
            submenu: []
        }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

initialize();

