"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = require("../components/layouts/app");
const login_1 = require("../components/layouts/login");
const React = require("react");
let defaultAction;
const routes = [
    {
        path: '/login',
        action: () => ({
            content: React.createElement(login_1.Login, null),
            title: 'Login',
        }),
    },
    {
        path: '/',
        action({ next }) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const route = yield next();
                return {
                    content: (React.createElement(app_1.App, Object.assign({}, route.props), route.content)),
                    title: route.title,
                };
            });
        },
        children: [
            {
                path: '/balance',
                action: defaultAction = (ctx) => ({
                    title: 'Balance',
                    content: React.createElement("div", null),
                }),
            },
            {
                path: '/',
                action: defaultAction,
            },
            {
                path: '*',
                action: () => ({
                    title: 'Wrong way',
                    content: React.createElement("div", null, "WRONG WAY"),
                }),
            },
        ],
    },
];
exports.routes = routes;
//# sourceMappingURL=routes.js.map