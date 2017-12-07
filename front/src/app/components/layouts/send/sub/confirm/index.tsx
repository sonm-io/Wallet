import * as React from 'react';
import { Input, Icon, Form } from 'antd';
import * as cn from 'classnames';
import IdentIcon from '../../../../common/ident-icon/index';
import { ICurrencyInfo } from 'app/api/types';
import Button from '../../../../common/button/index';

interface IProps {
    className?: string;
    fromAddress: string;
    toAddress: string;
    fromName: string;
    amount: string;
    gasLimit: string;
    gasPrice: string;
    currency: ICurrencyInfo;
    onConfirm: (password: string) => void;
    onCancel: () => void;
    passwordValidationMsg?: string;
}

export class SendConfirm extends React.PureComponent<IProps, any> {
    public handleConfrim = (event: any) => {
        event.preventDefault();

        const password = event.target.password.value;

        this.props.onConfirm && this.props.onConfirm(password);
    }

    public handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    }

    public render() {
        const {
            className,
            fromAddress,
            toAddress,
            amount,
            gasLimit,
            gasPrice,
            fromName,
            currency,
            passwordValidationMsg,
        } = this.props;

        return (
            <div className={cn('sonm-send-confirm', className)}>
                <h1 className="sonm-send-confirm__header">Transfer confirmation</h1>
                <section className="sonm-send-confirm__from-to">
                    <div className="sonm-send-confirm__account">
                        <IdentIcon address={fromAddress} className="sonm-send-confirm__account-blockies"/>
                        <span className="sonm-send-confirm__account-name">{fromName}</span>
                        <span className="sonm-send-confirm__account-addr">{fromAddress}</span>
                    </div>
                    <div className="sonm-send-confirm__arrow"/>
                    <div className="sonm-send-confirm__account">
                        <IdentIcon address={toAddress} className="sonm-send-confirm__account-blockies"/>
                        <span className="sonm-send-confirm__account-target">
                            {fromAddress}
                        </span>
                    </div>
                </section>
                <dl className="sonm-send-confirm__values">
                    <dt>Amount</dt>
                    <dd>{amount} {currency.symbol}</dd>
                    <dt>Gas limit</dt>
                    <dd>{gasLimit}</dd>
                    <dt>Gas price</dt>
                    <dd>{gasPrice} ETH</dd>
                </dl>
                <Form onSubmit={this.handleConfrim} className="sonm-send-confirm__password-form">
                    <h2>Please enter account password</h2>
                    <Form.Item
                        validateStatus={passwordValidationMsg ? 'error' : 'success'}
                        help={passwordValidationMsg}
                    >
                        <Input
                            name="password"
                            className="sonm-send-confirm__password-input"
                            prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Button
                        className="sonm-send-confirm__password-button"
                        type="submit"
                        color="violet"
                    >
                        Send
                    </Button>
                    <Button
                        className="sonm-send-confirm__password-button"
                        transparent
                        type="button"
                        onClick={this.handleCancel}
                    >
                        Back
                    </Button>
                </Form>
            </div>
        );
    }
}

export default SendConfirm;
