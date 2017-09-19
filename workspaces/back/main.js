'use strict';

const Web3 = require('web3');
const path = require('path');
const url = require('url');
const _ = require('lodash');
const fs = require('fs-extra');
const contract = require('truffle-contract');
const yaml = require('js-yaml');
const {app, BrowserWindow} = require('electron');

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

const routes = require('./router/index');

for ( const namespace in routes ) {
    for ( const action in routes[namespace] ) {
        if ( _.isObject(routes[namespace][action]) ) {
            for ( const subaction in routes[namespace][action] ) {
                app.on(`sonm.${namespace}.${action}.${subaction}`, routes[namespace][action][subaction] );
            }
        } else {
            app.on(`sonm.${namespace}.${action}`, routes[namespace][action] );
        }
    }
}

const init = async () => {
    try {
        const config = yaml.safeLoad(fs.readFileSync('./config/default.yml', 'utf8'));
        const provider = new Web3.providers.HttpProvider(_.get(config, "connection.host"));
        const web3 = new Web3(provider);
        const accounts =  await web3.eth.getAccounts();

        app.data = {
            web3: web3,
            provider: provider,
            account: accounts[0],
            config: config,
        }

        await routes.wallet.balance();

        //app.contracts = {}
        //const balance = await web3.eth.getBalance('0x23ea8516453f743b729a57b53369a6b50d98ae2c');
        // const balance = await web3.eth.getBalance(account);
        // console.log(balance);
        //
        // const data =  await fs.readJson('./contracts/TutorialToken.json');
        //
        // const tutorialToken = contract(await fs.readJson('./contracts/TutorialToken.json'));
        // tutorialToken.setProvider(provider);
        //
        // const cc = await tutorialToken.at('0x244329ed8d654472aa4c9a955a31fda91f5a2b0e');
        //
        // console.log((await cc.balanceOf(account)).c[0]);
    } catch ( err ) {
        console.log(err.stack);
    }
}

init();

console.log('Start');