'use strict';

const packager = require('electron-packager');
const rimraf = require('rimraf');
const platform = process.env.PLATFORM || 'darwin';

const params = {
    dir: '.',
    name: 'sonm-wallet',
    platform: platform,
    arch: 'x64',
    electronVersion: '1.8.1',
    out: './releases',
    appBundleId: '',
    appVersion: '0.0.1',
    overwrite: true,
    asar: false,
    icon: './front/assets/app-icon',
    bundle_id: '',
    appname: 'sonm-wallet',
    ignore: ['node_modules', 'dist', 'front'],
    prune: true,
    afterPrune: [(buildPath, electronVersion, platform, arch, callback) => {
        rimraf.sync(`${buildPath}/node_modules`);
        callback();
    }],
};

packager(params, function done_callback (err, appPaths) {
    if (err) {
        console.log(err);
    }

    console.log('Done!');
});
