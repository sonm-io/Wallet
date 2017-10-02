'use strict'

const packager = require('electron-packager');
const params = {
  dir: '.',
  name: 'wallet',
  platform: 'darwin',
  arch: 'x64',
  electronVersion: '1.8.1',
  out: '../releases',
  appBundleId: '',
  appVersion: '0.0.1',
  overwrite: true,
  asar: false,
  icon: '',
  bundle_id: '',
  appname: 'wallet',
  sourcedir: '.',
  packageManager: 'yarn',
  prune: false,
};

packager(params, function done_callback (err, appPaths) {
  if ( err ) {
    console.log(err);
  }

  console.log('Done!');
})
