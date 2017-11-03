const path = require('path');
const fs = require('fs');

const getFullPath = fromWorkspaceDir => path.join(__dirname, '..', fromWorkspaceDir);

function getExternalDependencies() {
  const dependencies = require(getFullPath('package.json')).dependencies || {};

  return Object.keys(dependencies);
}

const getModulesPath = (moduleName = '') => path.join(process.cwd(), 'node_modules', moduleName);

const getProcessArgv = () => require('minimist')(process.argv.slice(2));

function readJson(path) {
   return JSON.parse(fs.readFileSync(path).toString());
}

module.exports = {
  getExternalDependencies,
  getFullPath,
  getModulesPath,
  getProcessArgv,
  readJson,
};