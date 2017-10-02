const path = require('path')
const electron = require('electron')
const autoUpdater = require('./auto-updater')

const BrowserWindow = electron.BrowserWindow
const app = electron.app

const debug = /--debug/.test(process.argv[2])

if (process.mas) {
  app.setName('SONM Wallet')
}

console.log('process.version (node-js)', process.version)

let mainWindow = null

function initialize () {
  const shouldQuit = checkSingleInstance()

  if (shouldQuit) {
    return app.quit()
  }

  loadMainProcess()

  app.on('ready', function () {
    registerFrontendRoot()
    createWindow()
    autoUpdater.initialize()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

function createWindow () {
  const windowOptions = {
    width: 1080,
    minWidth: 680,
    height: 840,
    title: app.getName(),
    webPreferences: {
      webSecurity: false
    }
  }

  if (process.platform === 'linux') {
    windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
  }

  mainWindow = new BrowserWindow(windowOptions)
  mainWindow.loadURL(path.join('file://', __dirname, 'workspaces/front/assets/entry.html'))

  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()
    require('devtron').install()
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function checkSingleInstance () {
  if (process.mas) {
    return false
  }

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadMainProcess () {
  require('./workspaces/back/main')
  autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(() => app.quit())
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(() => app.quit())
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}

function registerFrontendRoot () {
  electron.protocol.interceptFileProtocol('file', (request, callback) => {
    const filePath = request.url.substr(7) // remove protocol file://
    let result

    if (filePath.startsWith('src/')) {
      result = path.join(__dirname, 'workspaces/front/src', filePath.substr(5))
    } else {
      result = filePath
    }

    console.log('referrer', request.referrer)
    console.log('filePath', filePath)
    callback(result)
  }, error => {
    if (error) {
      console.error('Failed to intercept file protocol', error)
    }
  })
}

