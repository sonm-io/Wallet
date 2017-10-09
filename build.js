'use strict';

const packager = require('electron-packager');
const rimraf = require('rimraf');
const pjson = require('./package.json');

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
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    const pjson = require('./package.json');
    for ( let key in pjson.devDependencies) {
      const dir = `${buildPath}/node_modules/${key}`;

      rimraf.sync(dir);
      console.log('remove', dir);
    }

    for ( let dir of ['.bin', 'electron', 'electron-prebuilt', 'electron-prebuilt-compile', 'electron-packager']) {
      dir = `${buildPath}/node_modules/${dir}`;

      rimraf.sync(dir);
      console.log('remove', dir);
    }

    const frontPackage = require('./workspaces/front/package.json');
    const backPackage = require('./workspaces/back/package.json');

    // uncomment after webpack )

    // for ( let key in frontPackage.dependencies) {
    //   if ( !backPackage.dependencies[key]) {
    //     const dir = `${buildPath}/node_modules/${key}`;
    //
    //     rimraf.sync(dir);
    //     console.log('remove', dir);
    //   }
    // }

    // fatal error on tslib. WTF?
    for ( let key in frontPackage.devDependencies) {
      if ( ['typescript'].includes(key) ) {
        const dir = `${buildPath}/node_modules/${key}`;

        rimraf.sync(dir);
        console.log('remove', dir);
      }
    }

    console.log(buildPath);
    callback();
  }],
};

packager(params, function done_callback (err, appPaths) {
  if ( err ) {
    console.log(err);
  }

  console.log('Done!');
});
