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
    onConfirm: (password: string) => Promise<string>;
    onCancel: (password: string) => Promise<string>;
}

export class SendConfirm extends React.PureComponent<IProps, any> {
    public handleConfrim = (event: any) => {
        debugger;
    }

    public handleCancel = (event: any) => {
        debugger;
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
            form,
        } = this.props;

        return (
            <div className={cn('sonm-send-confirm', className)}>
                <div>
                    <h1 className="sonm-send-confirm__header">Transfer confirmation</h1>
                    <section className="sonm-send-confirm__from-to">
                        <div className="sonm-send-confirm__account">
                            <IdentIcon address={fromAddress} />
                            <span className="sonm-send-confirm__account-name">
                                {fromName}
                            </span>
                            <span className="sonm-send-confirm__account-addr">
                                {fromAddress}
                            </span>
                        </div>
                        <div className="sonm-send-confirm__account">
                            <IdentIcon address={toAddress} />
                            <span className="sonm-send-confirm__account-name" />
                            <span className="sonm-send-confirm__account-addr">
                                {fromAddress}
                            </span>
                        </div>
                    </section>
                    <dl className="sonm-send-confirm__params">
                        <dt>Amount</dt>
                        <dd>{amount} {currency.symbol}</dd>
                        <dt>Gas limit</dt>
                        <dd>{gasLimit} WEI</dd>
                        <dt>Gas price</dt>
                        <dd>{gasPrice} WEI</dd>
                    </dl>
                    <Form onSubmit={this.handleConfrim}>
                        <h2>Please enter account password</h2>
                        {
                            form.getFieldDecorator('password', {
                                initialValue: gasPrice,
                                rules: [
                                    {required: true, message: 'Field is required'},
                                ],
                            })(
                                <Input
                                    className="sonm-send-confirm__password-input"
                                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )
                        }
                        <Button color="blue" transparent type="button" onClick={this.handleCancel}>Back</Button>
                        <Button color="blue" type="submit">Send</Button>
                    </Form>
                </div>
            </div>
        );
    }
}
