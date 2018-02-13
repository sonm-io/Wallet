'use strict';

const packager = require('electron-packager');
const rimraf = require('rimraf');
const platform = process.env.PLATFORM || 'darwin';

const params = {
    dir: '.',
    name: 'sonm-wallet',
    platform: platform,
    arch: 'x64',
    out: './releases',
    appBundleId: 'sonm-wallet',
    appVersion: require('./package.json').version,
    overwrite: true,
    asar: false,
    icon: './front/assets/app-icon',
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
