import * as React from 'react';
import * as cn from 'classnames';
// import { Form, Button, InputNumber, Input, Icon, Upload, Spin, Checkbox, Col, Row } from 'antd';
// import { FormComponentProps } from 'antd/lib/form/Form';
import { inject } from 'mobx-react';
import { Send, IResult } from './sub/send';
import { TransactionStore } from '../../../stores/transaction';
import { UserStore } from '../../../stores/user';

const TITLE_ETHER = 'Etherium';
// const TITLE_SNM = 'Sonm token';

export interface IProps {
  className?: string;
  isPending?: boolean;
  userStore?: UserStore;
  transactionStore?: TransactionStore;
}

@inject('userStore', 'transactionStore')
export class Transaction extends React.Component<IProps, any> {
  public static defaultProps = {
    userStore: {
      address: '0xADD7E55',
    },
  };

  public render() {
    const {
      className,
      userStore,
    } = this.props;

    return (
      <div className={cn('sonm-wallet', className)}>
        <h2 className="sonm-wallet__address">
          Your address: 0x{userStore && userStore.address}
        </h2>
        <Send title="Etherium" onSubmit={this.handleSubmit} currencySymbol="eth" />
        <Send title="SONM Tokens" onSubmit={this.handleSubmit} currencySymbol="snm" />
      </div>
    );
  }

  public handleSubmit = (params: IResult) => {
    const { userStore } = this.props;
    const { to, qty, gasLimit, gasPrice } = params;
    const currency = params.title === TITLE_ETHER
      ? 'eth'
      : 'snm';

    if (this.props.transactionStore) {
      this.props.transactionStore.processTransaction(
        userStore ? userStore.address : '',
        to,
        qty,
        currency,
        gasPrice,
        gasLimit,
      );
    }
  }
}
