import * as React from 'react';
import * as cn from 'classnames';
import { Form, Button, InputNumber, Input, Icon, Upload, Spin, Checkbox, Col, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as api from 'api';
import { navigate } from 'router';
import { inject } from 'mobx-react';

export interface IProps extends FormComponentProps {
  className?: string;
  isPending?: boolean;
  userStore: {
    address: string;
  };
  transactionStore: {
    processTransaction: (from: string, to: string, qty: string, gasPrice: string, gasLimit: string) => void;
  };
}

@inject('userStore', 'transactionStore')
class Me extends React.Component<IProps, any> {
  public state = {
    isPending: false,
  };

  public render() {
    const {
      className,
      form,
      userStore: {
        address,
      },
    } = this.props;

    const {
      isPending,
    } = this.state;

    return (
      <div className={cn('sonm-wallet', className)}>
        <h2 className="sonm-wallet__address">
          Your address: 0x{address}
        </h2>
        <Spin spinning={this.state.isPending} tip="Loading...">
          <Form onSubmit={this.handleSubmit} className="sonm-transaction__form">
            <Row type="flex" gutter={8}>
              <Col span={8}>
                <Form.Item {...Me.numberInputLayout} label="Etherium">
                  {form.getFieldDecorator('qty', {
                    rules: [
                      { required: true, message: 'Please input ETH quanity' },
                    ],
                  })(
                    <InputNumber
                      className="sonm-transaction__input"
                      min={0}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...Me.numberInputLayout} label="Wallet id">
                  {form.getFieldDecorator('to', {
                    normalize: Me.normalizeWalletId,
                    rules: [
                      { required: true, validator: Me.walletIdValidator },
                    ],
                  })(
                    <Input
                      className="sonm-transaction__input"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={this.handleSubmit} htmlType="submit">
                  Send
                </Button>
              </Col>
            </Row>
            <Row type="flex" gutter={8}>
              <Col span={8}>
                <Form.Item {...Me.numberInputLayout} label="Gas price">
                  {form.getFieldDecorator('gasPrice', {
                  })(
                    <InputNumber
                      className="sonm-transaction__input"
                      min={0}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...Me.numberInputLayout} label="Gas limit">
                  {form.getFieldDecorator('gasLimit', {
                  })(
                    <InputNumber
                      className="sonm-transaction__input"
                      min={0}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }

  public handleSubmit = (event: React.FormEvent<Form>) => {
    event.preventDefault();

    this.props.form.validateFields(async (err, { to, qty, gasPrice, gasLimit }) => {
      if (err) {
        return;
      }

      if (
        this.props.transactionStore.processTransaction(
          this.props.userStore.address,
          to,
          qty,
          gasPrice,
          gasLimit,
        )
      ) {
        this.props.form.setFields({
          password: {
            errors: '',
          },
          path: {
            errors: '',
          },
        });
      }
    });
  }

  public static normalizeWalletId(value: string) {
    if (value && value.length === 40) {
      return '0x' + value;
    }
    return value;
  }

  public static walletIdValidator(rule: any, value: string, callback: (msg?: string) => void) {
    if (value.length !== 42) {
      return callback('Etherium id length should be 42');
    }
    if (!value.startsWith('0x')) {
      return callback('Etherium id should starts with "0x"');
    }
    callback();
  }

  public static numberInputLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };
}

export const Transaction = Form.create()(Me);
