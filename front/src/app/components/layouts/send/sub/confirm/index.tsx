import * as React from 'react';
import Input from 'antd/es/input';
import Icon from 'antd/es/icon';
import Form from 'antd/es/form';

import * as cn from 'classnames';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { Button } from 'app/components/common/button/index';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import { HistoryStore } from 'app/stores/history';
import { Header } from 'app/components/common/header';

interface IProps {
    className?: string;
    mainStore?: MainStore;
    historyStore?: HistoryStore;
    onSuccess: () => void;
    onBack: () => void;
}

@inject('mainStore', 'historyStore')
@observer
export class SendConfirm extends React.Component<IProps, any> {
    public handleConfrim = async (event: any) => {
        const mainStore = this.props.mainStore;
        const historyStore = this.props.historyStore;
        if (!mainStore || !historyStore) { return; }

        event.preventDefault();

        const password = event.target.password.value;

        const isPasswordValid = await mainStore.checkSelectedAccountPassword(password);

        if (isPasswordValid) {
            (mainStore.confirmTransaction(password) as any).then(() => historyStore.update());

            this.props.onSuccess();
        }
    }

    public handleCancel = () => {
        this.props.mainStore && this.props.mainStore.resetValidation();

        this.props.onBack();
    }

    public render() {
        const mainStore = this.props.mainStore;

        if (!mainStore) { return null; }

        const accountAddress = mainStore.selectedAccountAddress;
        const account = mainStore.accountMap.get(accountAddress);
        const accountName = account ? account.name : '';
        const currency = mainStore.currencyMap.get(mainStore.selectedCurrencyAddress);
        const amount = mainStore.values.amount;
        const gasLimit = mainStore.values.gasLimit;
        const gasPrice = mainStore.values.gasPrice;
        const toAddress = mainStore.values.toAddress;
        const passwordValidationMsg = mainStore.validation.password;

        if (!currency) { return null; }

        return (
            <div className={cn('sonm-send-confirm', this.props.className)}>
                <Header className="sonm-send-confirm__header">Transfer confirmation</Header>
                <section className="sonm-send-confirm__from-to">
                    <div className="sonm-send-confirm__account">
                        <IdentIcon address={accountAddress} className="sonm-send-confirm__account-blockies"/>
                        <span className="sonm-send-confirm__account-name">{accountName}</span>
                        <span className="sonm-send-confirm__account-addr">{accountAddress}</span>
                    </div>
                    <div className="sonm-send-confirm__arrow"/>
                    <div className="sonm-send-confirm__account">
                        <IdentIcon address={toAddress} className="sonm-send-confirm__account-blockies"/>
                        <span className="sonm-send-confirm__account-target">
                            {toAddress}
                        </span>
                    </div>
                </section>
                <dl className="sonm-send-confirm__values">
                    <dt>Amount</dt>
                    <dd>{amount} {currency.symbol}</dd>
                    <dt>Gas limit</dt>
                    <dd>{gasLimit}</dd>
                    <dt>Gas price</dt>
                    <dd>{gasPrice} Gwei</dd>
                </dl>
                <Form onSubmit={this.handleConfrim} className="sonm-send-confirm__password-form">
                    <h2 className="sonm-send-confirm__password-header">Please enter account password</h2>
                    <Form.Item
                        className="sonm-send-confirm__password-field"
                        validateStatus={passwordValidationMsg ? 'error' : 'success'}
                        help={passwordValidationMsg}
                    >
                        <Input
                            autoComplete="off"
                            name="password"
                            className="sonm-send-confirm__password-input"
                            prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Button
                        className="sonm-send-confirm__password-button"
                        transparent
                        type="button"
                        onClick={this.handleCancel}
                    >
                        Back
                    </Button>
                    <Button
                        disabled={mainStore.isOffline}
                        className="sonm-send-confirm__password-button"
                        type="submit"
                        color="violet"
                    >
                        Send
                    </Button>
                </Form>
            </div>
        );
    }
}

export default SendConfirm;
