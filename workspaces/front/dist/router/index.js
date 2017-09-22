"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("universal-router");
const routes_1 = require("./routes");
const router = new Router(routes_1.routes);
const resolve = router.resolve.bind(router);
exports.resolve = resolve;
//# sourceMappingURL=index.js.map