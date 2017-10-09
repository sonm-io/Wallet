import * as React from 'react';
import {Form, Button, InputNumber, Input, Icon, Upload, Spin, Checkbox, Card} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';

export interface IResult {
  qty: string;
  to: string;
  gasPrice?: string;
  gasLimit?: string;
  title: string;
}

export interface IProps extends FormComponentProps {
  title: string;
  currencySymbol: any;
  className?: string;
  onSubmit: (data: IResult) => void;
}

class Me extends React.PureComponent<IProps, any> {
  public render() {
    const {
      form,
      title,
      className,
    } = this.props;

    return (
      <Card title={title} className={className}>
        <Form onSubmit={this.handleSubmit} className="sonm-transaction__form">
          <Form.Item
            {...Me.qtyLayout}
            label="Qty"
            className="sonm-transaction__qty"
          >
            {form.getFieldDecorator('qty', {
              rules: [
                {required: true, message: 'Please input ETH quanity'},
              ],
            })(
              <InputNumber
                className="sonm-transaction__input"
                min={0}
              />,
            )}
          </Form.Item>

          <Form.Item
            {...Me.inputLayout}
            label="Wallet id"
            className="sonm-transaction__address"
          >
            {form.getFieldDecorator('to', {
              normalize: Me.normalizeWalletId,
              rules: [
                {required: true, validator: Me.walletIdValidator},
              ],
            })(
              <Input
                className="sonm-transaction__input"
              />,
            )}
          </Form.Item>

          <Button
            type="primary"
            onClick={this.handleSubmit}
            htmlType="submit"
            className="sonm-transaction__submit"
          >
            Send
          </Button>

          <Form.Item
            {...Me.inputLayout}
            label="Gas price"
            className="sonm-transaction__gas-price"
          >
            {form.getFieldDecorator('gasPrice', {})(
              <InputNumber
                className="sonm-transaction__input"
                min={0}
              />,
            )}
          </Form.Item>

          <Form.Item
            {...Me.inputLayout}
            label="Gas limit"
            className="sonm-transaction__gas-limit"
          >
            {form.getFieldDecorator('gasLimit', {})(
              <InputNumber
                className="sonm-transaction__input"
                min={0}
              />,
            )}
          </Form.Item>
        </Form>
      </Card>
    );
  }

  public handleSubmit = (event: React.FormEvent<Form>) => {
    event.preventDefault();

    this.props.form.validateFields(async (err, { to, qty, gasPrice, gasLimit }) => {
      if (err) {
        return;
      }

      const { title } = this.props;

      if (
        this.props.onSubmit({
          to,
          qty,
          gasPrice,
          gasLimit,
          title,
        })
      ) {
        this.props.form.setFields({
          qty: {
            errors: '',
          },
          to: {
            errors: '',
          },
        });
      }
    });
  }

  public static normalizeWalletId(value: string) {
    if (value && value.length === 40 && !value.startsWith('0x')) {
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

  public static qtyLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
  public static inputLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
}

export const Send = Form.create()(Me);
