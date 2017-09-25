import * as React from 'react';
import * as cn from 'classnames';
import { Form, Button, Input, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { api, IPrivateKey } from 'api';
import { inject } from 'mobx-react';

export interface IProps extends FormComponentProps {
  className?: string;
  privateKey?: IPrivateKey;
}

export interface IState extends FormComponentProps {
  privateKey?: IPrivateKey;
}

@inject('privateKey')
class LoginInner extends React.Component<IProps, object> {
  public state = {
    privateKey: this.props.privateKey,
  };

  public render() {
    const {
      className,
      form,
    } = this.props;

    const {
      privateKey,
    } = this.props;

    if (privateKey !== null) {
      return this.renderFileOpen();
    }

    return (
      <div className="sonm-login">
        <div className={cn('sonm-login__inner', className)}>
          <Form onSubmit={this.handleSubmit} className="sonm-login__form">
            <Form.Item>
              {form.getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Button type="primary" htmlType="submit" className="sonm-login__button">
              Log in
            </Button>
          </Form>
        </div>
      </div>
    );
  }

  private renderFileOpen = () => {
    return (
      <div className="sonm-open-key">

      </div>
    );
  }

  public handleSubmit = (event: React.FormEvent<Form>) => {
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        api.login();
      }
    });
  }
}

export const Login = Form.create()(LoginInner);
