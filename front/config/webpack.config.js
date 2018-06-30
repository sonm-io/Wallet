const base = require('./webpack.base-config');
const { getFullPath } = require('./utils');
const needsAnalyze = process.env.WEBPACK_ANALYZE || process.env.WEBPACK_STATS;

module.exports = {
    ...base,

    entry: (() => {
        const result = {
            app: getFullPath('./src/entry.ts'),
            style: getFullPath('./src/app/less/entry.less'),
        };

        if (needsAnalyze) {
            result.worker = getFullPath('./src/worker/back.worker.ts');
        }

        return result;
    })(),
};
