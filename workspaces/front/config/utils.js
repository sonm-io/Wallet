const path = require('path');

const getFullPath = fromWorkspaceDir => path.join(__dirname, '..', fromWorkspaceDir);

function getExternalDependencies() {
  const dependencies = require(getFullPath('package.json')).dependencies || {};

  return Object.keys(dependencies);
}

const getModulesPath = (moduleName = '') => path.join(process.cwd(), 'node_modules', moduleName);

const getProcessArgv = () => require('minimist')(process.argv.slice(2));

module.exports = {
  getExternalDependencies,
  getFullPath,
  getModulesPath,
  getProcessArgv,
};