const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const fileContent = fs.readFileSync(path.join(__dirname, './default.yml'), 'utf8');
module.exports = yaml.safeLoad(fileContent);