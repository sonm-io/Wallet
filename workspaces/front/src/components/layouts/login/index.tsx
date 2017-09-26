import * as React from 'react';
import * as cn from 'classnames';
import { Form, Button, Input, Icon, Upload, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { api } from 'api';
import { inject } from 'mobx-react';

export interface IProps extends FormComponentProps {
  className?: string;
  privateKey?: string;
}

export interface IState extends FormComponentProps {
  privateKey: string;
}

@inject('privateKey')
class LoginInner extends React.Component<IProps, object> {
  public state = {
    privateKey: this.props.privateKey,
    isLoading: false,
  };

  public render() {
    const {
      className,
      form,
    } = this.props;

    return (
      <div className="sonm-login">
        <div className={cn('sonm-login__inner', className)}>
          <Spin spinning={this.state.isLoading} tip="Loading...">
            <Form onSubmit={this.handleSubmit} className="sonm-login__form">
              <Form.Item>
                <Upload
                  showUploadList
                  action=""
                  multiple={false}
                  beforeUpload={this.handleSelectFile}
                >
                  <Button className="sonm-login__file">
                    <Icon type="upload" /> Click to {this.state.privateKey ? 'change' : 'set'} file path
                  </Button>
                </Upload>
                {form.getFieldDecorator('path', {
                  rules: [
                    { required: true, message: 'Please select file' },
                  ],
                })(
                  <Input
                    readOnly
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
              <Button type="primary" htmlType="submit" className="sonm-login__button">
                Log in
              </Button>
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

      this.setState({ isLoading: true });
      try {
        await api.login(path, password);

      } catch (e) {

      } finally {
        this.setState({ isLoading: false });
      }
    });
  }
}

export const Login = Form.create()(LoginInner);
