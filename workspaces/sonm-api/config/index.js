const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

function readYaml(fileName) {
  let result = {};
  const filePath = path.join(__dirname, fileName);

  if (fs.existsSync(filePath)) {
    result = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  }
  
  return result;
}

const environment  = process.env.NODE_ENV || 'development';
const baseConfig = readYaml('default.yml');
const envOverrides = readYaml(`${environment}.yml`);

module.exports = Object.assign(baseConfig, envOverrides);