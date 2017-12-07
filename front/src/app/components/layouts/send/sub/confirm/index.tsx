import * as React from 'react';
import { Input, Icon, Form } from 'antd';
import * as cn from 'classnames';
import IdentIcon from '../../../../common/ident-icon/index';
import { ICurrencyInfo } from 'app/api/types';
import Button from '../../../../common/button/index';
import { FormComponentProps } from 'antd/lib/form/Form';

interface IProps extends FormComponentProps {
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
}

export class SendConfirm extends React.PureComponent<IProps, any> {
    public handleConfrim = (event: any) => {
        const password = event.target.password;

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
        } = this.props;

        return (
            <div className={cn('sonm-send-confirm', className)}>
                    <h1 className="sonm-send-confirm__header">Transfer confirmation</h1>
                    <section className="sonm-send-confirm__top">
                        <div className="sonm-send-confirm__account">
                            <IdentIcon address={fromAddress} className="sonm-send-confirm__account__blockies"/>
                            <span className="sonm-send-confirm__account__name">{fromName}</span>
                            <span className="sonm-send-confirm__account__addr">{fromAddress}</span>
                        </div>
                        <div className="sonm-send-confirm__icon"/>
                        <div className="sonm-send-confirm__account">
                            <IdentIcon address={toAddress} className="sonm-send-confirm__account__blockies"/>
                            <div className="sonm-send-confirm__account__addr-to">
                                {fromAddress}
                            </div>
                        </div>
                    </section>
                    <section className="sonm-send-confirm__bottom">
                        <dl className="sonm-send-confirm__bottom__params">
                            <dt>Amount</dt>
                            <dd>{amount} {currency.symbol}</dd>
                            <dt>Gas limit</dt>
                            <dd>{gasLimit}</dd>
                            <dt>Gas price</dt>
                            <dd>{gasPrice} ETH</dd>
                        </dl>
                        <Form onSubmit={this.handleConfrim} className="sonm-send-confirm__bottom__form">
                            <h2>Please enter account password</h2>
                            <Input
                                className="sonm-send-confirm__password-input"
                                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                type="password"
                                placeholder="Password"
                            />
                            <div className="sonm-send-confirm__bottom__form__buttons">
                            <Button transparent type="button" onClick={this.handleCancel}>Back</Button>
                            <Button type="submit" color="violet">Send</Button>
                            </div>
                        </Form>
                    </section>
            </div>
        );
    }
}

export default SendConfirm;
