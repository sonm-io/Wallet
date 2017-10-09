import * as React from 'react';
import * as cn from 'classnames';
import { Form, Button, InputNumber, Input, Icon, Upload, Spin, Checkbox, Col, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { inject } from 'mobx-react';
import { Send, IResult } from './sub/send';

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
export class Transaction extends React.Component<IProps, any> {
  public render() {
    const {
      className,
      userStore: {
        address,
      },
    } = this.props;

    return (
      <div className={cn('sonm-wallet', className)}>
        <h2 className="sonm-wallet__address">
          Your address: 0x{address}
        </h2>
        <Send title="Etherium" onSubmit={this.handleSubmit} currencySymbol="eth" />
        <Send title="SONM Tokens" onSubmit={this.handleSubmit} currencySymbol="snm" />
      </div>
    );
  }

  public handleSubmit = (params: IResult) => {

  }
}

