const path = require('path');
const fs = require('fs');

const getFullPath = fromWorkspaceDir =>
    path.join(__dirname, '..', fromWorkspaceDir);

const getModulesPath = (moduleName = '') =>
    path.join(process.cwd(), 'node_modules', moduleName);

const getProcessArgv = () => require('minimist')(process.argv.slice(2));

function readJson(path) {
    return JSON.parse(fs.readFileSync(path).toString());
}

function getPackageJson() {
    return require(path.join(__dirname, '../..', 'package.json'));
}

module.exports = {
    getFullPath,
    getModulesPath,
    getProcessArgv,
    readJson,
    getPackageJson,
};
