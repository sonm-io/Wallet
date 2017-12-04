const  { getFullPath } = require('./utils');
const typescript = require('rollup-plugin-typescript');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: getFullPath('src/entry.tsx'),
  external: [
    'electron',
  ],
  output: {
    file: getFullPath('bundle/bundle.js'),
    format: 'cjs',
  },
  plugins: [
    typescript({
      typescript: require('typescript'), // 2.5.2
    }),
    commonjs(),
  ],
};