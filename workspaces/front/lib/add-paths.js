const path = require('path');
const rootPath = path.join(__dirname, '..', 'dist');
require('app-module-path').addPath(rootPath);
