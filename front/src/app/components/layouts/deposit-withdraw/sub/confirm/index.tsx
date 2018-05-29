/*import * as React from 'react';
import Input from 'antd/es/input';
import Icon from 'antd/es/icon';
import { Form, FormField } from 'app/components/common/form';

import * as cn from 'classnames';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { Button } from 'app/components/common/button/index';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores/';
import { Header } from 'app/components/common/header';
import { SendStore } from 'app/stores/send';
interface IProps {
    className?: string;
    onSuccess: () => void;
    onBack: () => void;
    action: string;

    // fromAddress?: string;
    // fromName?: string;
    // amount?: string;
    // gasLimit?: string;
    // gasPrice?: string;
    // currency?: any;
}

@observer
export class DepositWithdrawConfirm extends React.Component<IProps, any> {
    public state = {
        password: '',
        validationPassword: '',
    };

    public handleConfrim = async (event: any) => {
        const historyStore = rootStore.dwHistoryStore;

        event.preventDefault();

        const password = this.state.password;

        const isPasswordValid = await this.store.checkSelectedAccountPassword(
            password,
        );

        if (isPasswordValid) {
            (this.store.confirmTransaction(password) as any).then(() =>
                historyStore.update(),
            );

            this.store.resetUserInput();

            this.setState({ validationPassword: '' });

            this.props.onSuccess();
        } else {
            this.setState({ validationPassword: 'Invalid password' });
        }
    };

    protected get store(): SendStore {
        return this.props.action === 'deposit'
            ? rootStore.depositStore
            : rootStore.withdrawStore;
    }

    public handleCancel = () => {
        this.store.resetServerValidation();

        this.props.onBack();
    };

    public handleChange = (e: any) => {
        this.setState({ password: e.target.value });
    };

    public render() {
        const mainStore = rootStore.mainStore;

        // const {
        //     fromAddress,
        //     fromName,
        //     amount,
        //     gasLimit,
        //     gasPrice,
        //     currency,
        // } = this.props;

        const fromAddress = this.store.fromAddress;
        const account = mainStore.accountMap.get(fromAddress);
        const fromName = account ? account.name : '';
        const currency = mainStore.currencyMap.get(this.store.currencyAddress);
        const amount = this.store.amount;
        const gasLimit = this.store.gasLimit;
        const gasPrice = this.store.gasPriceGwei;

        if (!currency) {
            return null;
        }

        return (
            <div
                className={cn(
                    'sonm-deposit-withdraw-confirm',
                    this.props.className,
                )}
            >
                <Header className="sonm-deposit-withdraw-confirm__header">
                    From account to account
                </Header>
                <section className="sonm-deposit-withdraw-confirm__from-to">
                    <div className="sonm-deposit-withdraw-confirm__account">
                        <IdentIcon
                            address={fromAddress || ''}
                            className="sonm-deposit-withdraw-confirm__account-blockies"
                        />
                        <span className="sonm-deposit-withdraw-confirm__account-name">
                            {fromName}
                        </span>
                        <span className="sonm-deposit-withdraw-confirm__account-addr">
                            {fromAddress}
                        </span>
                    </div>
                    <dl className="sonm-deposit-withdraw-confirm__values">
                        <div className="sonm-deposit-withdraw-confirm__values-amount">
                            <dt>Amount</dt>
                            <dd>
                                {amount} {currency.symbol}
                            </dd>
                        </div>
                        <div className="sonm-deposit-withdraw-confirm__values-gas-limit">
                            <dt>Gas limit</dt>
                            <dd>{gasLimit}</dd>
                        </div>
                        <div className="sonm-deposit-withdraw-confirm__values-gas-price">
                            <dt>Gas price</dt>
                            <dd>{gasPrice} Gwei</dd>
                        </div>
                    </dl>
                </section>
                <dl className="sonm-deposit-withdraw-confirm__commission">
                    <div className="sonm-deposit-withdraw-confirm__commission-grid">
                        <div className="sonm-deposit-withdraw-confirm__commission-grid-left">
                            <dt>You get</dt>
                            <dd>
                                {amount} {currency.symbol}
                            </dd>
                        </div>
                        <div className="sonm-deposit-withdraw-confirm__commission-grid-right">
                            <dt>SONM commission</dt>
                            <dd>0</dd>
                        </div>
                    </div>
                </dl>
                <div className="sonm-deposit-withdraw-confirm__password">
                    <h2 className="sonm-deposit-withdraw-confirm__password-header">
                        Confirm operation
                    </h2>
                    <span className="sonm-deposit-withdraw-confirm__password-description">
                        Please, enter password for this account to confirm
                        operation
                    </span>
                    <Form
                        onSubmit={this.handleConfrim}
                        className="sonm-deposit-withdraw-confirm__password-form"
                    >
                        <FormField
                            label=""
                            className="sonm-deposit-withdraw-confirm__password-field"
                            error={this.state.validationPassword}
                        >
                            <Input
                                autoComplete="off"
                                name="password"
                                className="sonm-deposit-withdraw-confirm__password-input"
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ fontSize: 13 }}
                                    />
                                }
                                type="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </FormField>
                    </Form>
                </div>
                <div className="sonm-deposit-withdraw-confirm__button-ct">
                    <Button
                        className="sonm-send-confirm__button"
                        transparent
                        type="button"
                        onClick={this.handleCancel}
                    >
                        Back
                    </Button>
                    <Button
                        disabled={mainStore.isOffline}
                        className="sonm-deposit-withdraw-confirm__button"
                        type="submit"
                        color="violet"
                        onClick={this.handleConfrim}
                    >
                        Deposit
                    </Button>
                </div>
            </div>
        );
    }
}

export default DepositWithdrawConfirm;
*/
