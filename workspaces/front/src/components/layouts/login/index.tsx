import * as React from 'react';
import * as cn from 'classnames';
import { Form, Button, Input, Icon, Upload, Spin, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as api from 'api';
import { navigate } from 'router';

export interface IProps extends FormComponentProps {
  className?: string;
  privateKey?: string;
}

class LoginInner extends React.Component<IProps, any> {
  public state = {
    privateKey: this.readPrivateKey(),
    isLoading: false,
  };

  public render() {
    const {
      className,
      form,
    } = this.props;

    return (
      <div className="sonm-login">
        <img src="../assets/img/sonm-logo-white-bg.svg" className="sonm-login__logo" />
        <div className={cn('sonm-login__inner', className)}>
          <Spin spinning={this.state.isLoading} tip="Loading...">
            <Form onSubmit={this.handleSubmit} className="sonm-login__form">
              <Form.Item>
                <Upload.Dragger
                  showUploadList={false}
                  action=""
                  multiple={false}
                  beforeUpload={this.handleSelectFile}
                  className="sonm-login__drag"
                >
                  <p className="sonm-login__drag__icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="sonm-login__drag__text">
                    Click or drag to {this.state.privateKey ? 'change' : 'set'} file path
                  </p>
                  <p className="sonm-login__drag__hint">
                    Support for xxx file
                  </p>
                </Upload.Dragger>
                {form.getFieldDecorator('path', {
                  rules: [
                    { required: true, message: 'Please select file' },
                  ],
                })(
                  <Input
                    type="text"
                    placeholder="/path/to/file"
                  />,
                )}
              </Form.Item>
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
              <div className="sonm-login__button-container">
                {form.getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: this.state.privateKey !== '',
                })(
                  <Checkbox className="sonm-login__remember">
                    Remember file path
                  </Checkbox>,
                )}
                <Button type="primary" htmlType="submit" className="sonm-login__button">
                  Log in
                </Button>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }

  private handleSelectFile = (event: any) => {
    this.setState({ privateKey: event.path });

    this.props.form.setFieldsValue({
      path: event.path,
    });

    return false;
  }

  public handleSubmit = (event: React.FormEvent<Form>) => {
    event.preventDefault();

    this.props.form.validateFields(async (err, { path, password }) => {
      if (err) {
        return;
      }

      let response: api.ILoginResponse;

      this.setState({ isLoading: true });
      try {
        response = await api.methods.login(path, password);
      } catch (e) {
        response = {
          success: false,
          error:  e.message,
        };
      } finally {
        this.setState({ isLoading: false });
      }

      navigate({ path: '/main' });

      // if (response.success) {
      //   navigate({ path: '/main' });
      // } else {
      //   if (response.validation) {
      //     this.props.form.setFields({
      //       password: {
      //         errors: [response.validation.password],
      //       },
      //       path: {
      //         errors: [response.validation.path],
      //       },
      //     });
      //   }
      // }
    });
  }

  private readPrivateKey() {
    let result: string;

    try {
      result = window.localStorage.getItem('private-key') || '';
    } catch (e) {
      result = '';
    }

    return result;
  }
}

export const Login = Form.create()(LoginInner);
