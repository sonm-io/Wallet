"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const cn = require("classnames");
const antd_1 = require("antd");
const api_1 = require("api");
class LoginInner extends React.Component {
    render() {
        const { className, form, } = this.props;
        return (React.createElement("div", { className: "sonm-login" },
            React.createElement("div", { className: cn('sonm-login__inner', className) },
                React.createElement(antd_1.Form, { onSubmit: this.handleSubmit, className: "sonm-login__form" },
                    React.createElement(antd_1.Form.Item, null, form.getFieldDecorator('password', {
                        rules: [
                            { required: true, message: 'Please input your Password!' },
                        ],
                    })(React.createElement(antd_1.Input, { prefix: React.createElement(antd_1.Icon, { type: "lock", style: { fontSize: 13 } }), type: "password", placeholder: "Password" }))),
                    React.createElement(antd_1.Button, { type: "primary", htmlType: "submit", className: "sonm-login__button" }, "Log in")))));
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                api_1.api.login();
            }
        });
    }
}
exports.Login = antd_1.Form.create()(LoginInner);
//# sourceMappingURL=index.js.map