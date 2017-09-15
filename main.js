'use strict';

const Web3 = require('web3');
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const web3 = new Web3('http://172.16.1.38:8545');

const main = async () => {
    try {
        const balance = await web3.eth.getBalance('0x23ea8516453f743b729a57b53369a6b50d98ae2c');
        console.log(balance);
    } catch ( err ) {
        console.log(err.stack);
    }
}

main();


let win;

function createWindow () {
    win = new BrowserWindow({width: 800, height: 600});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

const routes = require('./router');

for ( const namespace in routes ) {
    for ( const action in routes[namespace] ) {
        app.on(`sonm.${namespace}.${action}`, routes[namespace][action] );
    }
}

console.log('Start');