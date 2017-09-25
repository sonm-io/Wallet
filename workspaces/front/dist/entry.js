"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const react_dom_1 = require("react-dom");
const router_1 = require("./router");
const history_1 = require("./router/history");
const queryStr = require("query-string");
const mobx_react_1 = require("mobx-react");
const stores = require("./stores");
const api_1 = require("./api");
let privateKey;
/**
 * Renders app with state corresponding to given location
 * @param {Object} location
 */
function renderByPath({ pathname, search }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { content, title } = yield router_1.resolve({ pathname, query: queryStr.parse(search) });
        window.document.title = title;
        react_dom_1.render(React.createElement(mobx_react_1.Provider, Object.assign({}, stores, { api: api_1.api, privateKey: privateKey, key: "app-root" }), content), window.document.querySelector('#root'));
    });
}
const waitForKeys = api_1.api.getPrivateKeys().then(x => privateKey = x);
const waitForLoad = new Promise(done => {
    window.addEventListener('DOMContentLoaded', done);
});
function init() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield Promise.all([waitForKeys, waitForLoad]);
        history_1.history.listen(renderByPath);
        renderByPath({ pathname: '/login', search: '' });
    });
}
init();
//# sourceMappingURL=entry.js.map