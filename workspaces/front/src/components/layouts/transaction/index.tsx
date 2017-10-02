import * as React from 'react';
import * as cn from 'classnames';
import { Form, Button, InputNumber, Icon, Upload, Spin, Checkbox, Col, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as api from 'api';
import { navigate } from 'router';
import { inject } from 'mobx-react';

export interface IProps extends FormComponentProps {
  className?: string;
  isPending?: boolean;
}

@inject('userStore', 'transactions')
class Me extends React.Component<IProps, any> {
  public state = {
    isPending: false,
  };

  public render() {
    const {
      className,
      form,
    } = this.props;

    const {
      isPending,
    } = this.state;

    return (
      <div className={cn('sonm-transaction', className)}>
        <Spin spinning={this.state.isPending} tip="Loading...">
          <Form onSubmit={this.handleSubmit} className="sonm-transaction__form">
            <Row type="flex">
              <Col span={8}>
                <InputNumber
                  formatter={Me.ethFormater}
                >

                </InputNumber>
              </Col>
              <Col span={8}>
                <InputNumber>

                </InputNumber>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={8}>
                <InputNumber>

                </InputNumber>
              </Col>
              <Col span={8}>
                <InputNumber>

                </InputNumber>
              </Col>
              <Col span={8}>
                <Button />
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }

  public handleSubmit = (event: React.FormEvent<Form>) => {
    event.preventDefault();

    this.props.form.validateFields(async (err, { path, password }) => {
      if (err) {
        return;
      }

    });
  }

  public static ethFormater(value: string) {
    return `ETH ${value}`;
  }
}

export const Transaction = Form.create()(Me);
