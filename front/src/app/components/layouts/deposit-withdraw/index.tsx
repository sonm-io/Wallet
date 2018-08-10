import * as React from 'react';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import { FormField } from 'app/components/common/form';
import { SendStore } from 'app/stores/send';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { AccountItem } from 'app/components/common/account-item';
import { Input } from 'app/components/common/input';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';
import { IChangeParams } from 'app/components/common/types';
import {
    injectRootStore,
    IHasRootStore,
    Layout,
} from 'app/components/layouts/layout';
import { RootStore } from 'app/stores';

interface IProps extends IHasRootStore {
    className?: string;
    onSuccess: () => void;
    onNotAvailable: () => void;
    onConfirm: () => void;
    onBack: () => void;
    isConfirmation: boolean;
}

interface IDWProps extends IProps {
    title: string;
    sendStore: SendStore;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

@injectRootStore
export class Deposit extends Layout<IProps> {
    public render() {
        return (
            <DepositWithdraw
                {...this.props}
                sendStore={this.rootStore.depositStore}
                title="Deposit"
            />
        );
    }
}

@injectRootStore
export class Withdraw extends Layout<IProps> {
    public render() {
        return (
            <DepositWithdraw
                {...this.props}
                sendStore={this.rootStore.withdrawStore}
                title="Withdraw"
            />
        );
    }
}

@observer
class DepositWithdraw extends React.Component<IDWProps, any> {
    // ToDo make stateless
    protected get rootStore() {
        return this.props.rootStore as RootStore;
    }

    public state = {
        validationPassword: '',
    };

    protected getCurrency = () =>
        this.rootStore.currencyStore.getItem(this.store.currencyAddress);

    protected syncStores() {
        autorun(() => {
            const fromAddress = this.rootStore.myProfilesStore
                .currentProfileAddress;
            const primaryTokenAddress = this.rootStore.currencyStore
                .primaryTokenAddress;

            this.props.sendStore.setUserInput({
                fromAddress,
                toAddress: fromAddress,
                currencyAddress: primaryTokenAddress,
            });
        });
    }

    public componentDidMount() {
        if (this.rootStore.myProfilesStore.accountAddressList.length === 0) {
            this.props.onNotAvailable();
        } else {
            this.syncStores();
        }
    }

    protected get store(): SendStore {
        return this.props.sendStore;
    }

    protected handleSubmit = (event: any) => {
        event.preventDefault();
        this.props.onConfirm();
    };

    public handleCancel = () => {
        this.props.onBack();
    };

    protected handleChangeFormInput = (params: IChangeParams<string>) => {
        this.store.setUserInput({ [params.name]: params.value });
    };

    protected handleSetMaximum = () => {
        this.store.setUserInput({
            amountEther: this.store.currentBalanceMaximum,
        });
    };

    // TODO
    protected handleChangePriority = (value: string) => {
        const [min, max] = this.rootStore.gasPrice.gasPriceThresholds;
        let gasPrice = this.rootStore.gasPrice.averageGasPrice;

        if (value === 'low') {
            gasPrice = min;
        } else if (value === 'high') {
            gasPrice = max;
        }

        const gasPriceGwei = moveDecimalPoint(gasPrice, -9);

        this.store.setUserInput({ gasPriceGwei });
    };

    public handleConfrim = async (password: string) => {
        const isPasswordValid = await this.store.checkSelectedAccountPassword(
            password,
        );

        if (isPasswordValid) {
            (this.store.confirmTransaction(password) as any).then(() =>
                this.rootStore.dwHistoryListStore.update(),
            );

            this.store.resetUserInput();

            this.setState({ validationPassword: '' });

            this.props.onSuccess();
        } else {
            this.setState({ validationPassword: 'Invalid password' });
        }
    };

    public renderAccount() {
        const account = this.rootStore.myProfilesStore.accountList.find(
            item => item.address === this.store.fromAddress,
        );
        const className = cn(
            'deposit-withdraw__account',
            this.props.isConfirmation
                ? 'deposit-withdraw__account--confirmation'
                : null,
        );

        if (account) {
            const { name, address } = account;

            return this.props.isConfirmation ? (
                <AccountItem
                    name={name}
                    address={address}
                    className={className}
                />
            ) : (
                <AccountItem {...account} className={className} />
            );
        } else {
            return null;
        }
    }

    public renderAmount() {
        const currency = this.getCurrency();
        if (!currency) {
            return null;
        }

        return (
            <React.Fragment>
                <FormField
                    className="deposit-withdraw__amount"
                    key="amount"
                    error={this.store.validationAmount}
                    label="Amount"
                >
                    <Input
                        name="amountEther"
                        onChange={this.handleChangeFormInput}
                        placeholder="Amount"
                        value={this.store.userInput.amountEther}
                        readOnly={this.props.isConfirmation}
                    />
                </FormField>
                {this.props.isConfirmation ? null : (
                    <Button
                        className="deposit-withdraw__btn-max"
                        key="btn-max"
                        color="blue"
                        transparent
                        square
                        onClick={this.handleSetMaximum}
                    >
                        Add maximum
                    </Button>
                )}
                <FormField
                    className="deposit-withdraw__gas-limit"
                    key="gas-limit"
                    label="Gas limit"
                    error={this.store.validationGasLimit}
                >
                    <Input
                        className="sonm-send__input"
                        name="gasLimit"
                        value={this.store.userInput.gasLimit}
                        onChange={this.handleChangeFormInput}
                        placeholder={this.store.gasLimit}
                        readOnly={this.props.isConfirmation}
                    />
                </FormField>
                <FormField
                    className="deposit-withdraw__gas-price"
                    key="gas-price"
                    label="Gas price"
                    error={this.store.validationGasPrice}
                >
                    <Input
                        className="sonm-send__input"
                        name="gasPriceGwei"
                        value={this.store.userInput.gasPriceGwei}
                        onChange={this.handleChangeFormInput}
                        placeholder={this.store.gasPriceGwei}
                        readOnly={this.props.isConfirmation}
                    />
                </FormField>
                <span className="deposit-withdraw__gwei" key="gwei">
                    Gwei
                </span>
                {this.props.isConfirmation ? null : (
                    <PriorityInput
                        className="deposit-withdraw__btn-priority"
                        key="btn-priority"
                        valueList={['low', 'normal', 'high']}
                        value={this.store.priority}
                        onChange={this.handleChangePriority}
                    />
                )}
            </React.Fragment>
        );
    }

    public renderCommission() {
        const currency = this.getCurrency();
        if (!currency) {
            return null;
        }

        return (
            <React.Fragment>
                <dl className="deposit-withdraw__you-get">
                    <dt className="deposit-withdraw__you-get-label">You get</dt>
                    <dd>
                        {this.store.amount === ''
                            ? '- - -'
                            : `${this.store.amount} ${currency.symbol}`}
                    </dd>
                </dl>
                <dl className="deposit-withdraw__commission">
                    <dt className="deposit-withdraw__commission-label">
                        SONM commission
                    </dt>
                    <dd>0</dd>
                </dl>
            </React.Fragment>
        );
    }

    protected renderPasswordConfirmation() {
        return (
            <ConfirmationPanel
                className="deposit-withdraw__confirmation-panel"
                labelSubmit={this.props.title.toUpperCase()}
                onSubmit={
                    !this.rootStore.mainStore.isOffline
                        ? this.handleConfrim
                        : undefined
                }
                onCancel={this.handleCancel}
                validationMessage={this.state.validationPassword}
            />
        );
    }

    public renderNextButton() {
        return (
            <Button
                className="deposit-withdraw__next-button"
                onClick={this.handleSubmit}
                type="submit"
                color="violet"
                disabled={
                    !this.store.isFormValid || !this.store.hasNecessaryValues
                }
            >
                NEXT
            </Button>
        );
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={cn('deposit-withdraw', className)}>
                <div className="deposit-withdraw__header">
                    From and to account
                </div>
                {this.renderAccount()}
                {this.renderAmount()}
                <span className="deposit-withdraw__line" key="line" />
                {this.renderCommission()}
                {this.props.isConfirmation
                    ? this.renderPasswordConfirmation()
                    : this.renderNextButton()}
            </div>
        );
    }
}
