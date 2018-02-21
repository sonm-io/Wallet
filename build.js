'use strict';

const packager = require('electron-packager');
const platform = process.env.PLATFORM || 'darwin';

const params = {
    dir: '.',
    name: 'sonm-wallet',
    platform: platform,
    arch: 'x64',
    out: './releases',
    appBundleId: 'sonm-wallet',
    overwrite: true,
    asar: false,
    icon: './front/assets/app-icon',
    ignore: path => {
        return (
            Boolean(path) &&
            !path.startsWith('/docs') &&
            path !== '/package.json' &&
            path !== '/main.js'
        );
    },
};

packager(params, function done_callback(err, appPaths) {
    if (err) {
        console.log(err);
    }

    console.log('Done!');
});
