"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
function login() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
    });
}
function getPrivateKeys() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = window.localStorage.getItem('key');
        }
        catch (e) {
            result = null;
        }
        return result;
    });
}
const api = {
    login,
    getPrivateKeys,
};
exports.api = api;
//# sourceMappingURL=api.js.map