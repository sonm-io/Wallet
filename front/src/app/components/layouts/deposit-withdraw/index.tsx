import * as React from 'react';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import { FormField } from 'app/components/common/form';
import { SendStore } from 'app/stores/send';
import { rootStore } from 'app/stores';
import { ISendFormValues } from 'app/stores/types';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { AccountItem } from 'app/components/common/account-item';
import { Input } from 'app/components/common/input';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';

interface IProps {
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

export function Deposit(props: IProps) {
    return (
        <DepositWithdraw
            {...props}
            sendStore={rootStore.depositStore}
            title="Deposit"
        />
    );
}

export function Withdraw(props: IProps) {
    return (
        <DepositWithdraw
            {...props}
            sendStore={rootStore.withdrawStore}
            title="Withdraw"
        />
    );
}

@observer
class DepositWithdraw extends React.Component<IDWProps, any> {
    public state = {
        validationPassword: '',
    };

    protected syncStores() {
        autorun(() => {
            const fromAddress = rootStore.marketStore.marketAccountAddress;
            const primaryTokenAddress = rootStore.mainStore.primaryTokenAddress;

            this.props.sendStore.setUserInput({
                fromAddress,
                toAddress: fromAddress,
                currencyAddress: primaryTokenAddress,
            });
        });
    }

    public componentDidMount() {
        if (rootStore.mainStore.accountAddressList.length === 0) {
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

    protected handleChangeFormInput(value: Partial<ISendFormValues>) {
        this.store.setUserInput(value);
    }

    protected handleChangeFormInputEvent(
        name: keyof ISendFormValues,
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const value = event.target.value;

        this.handleChangeFormInput({ [name]: value });
    }

    protected handleChangeAmount = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => this.handleChangeFormInputEvent('amountEther', event);

    protected handleChangeGasLimit = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => this.handleChangeFormInputEvent('gasLimit', event);

    protected handleChangeGasPrice = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => this.handleChangeFormInputEvent('gasPriceGwei', event);

    protected handleSetMaximum = () => {
        this.store.setUserInput({
            amountEther: this.store.currentBalanceMaximum,
        });
    };

    // TODO
    protected handleChangePriority = (value: string) => {
        const [min, max] = rootStore.mainStore.gasPriceThresholds;
        let gasPrice = rootStore.mainStore.averageGasPrice;

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
                rootStore.dwHistoryStore.update(),
            );

            this.store.resetUserInput();

            this.setState({ validationPassword: '' });

            this.props.onSuccess();
        } else {
            this.setState({ validationPassword: 'Invalid password' });
        }
    };

    public renderAccount() {
        const account = rootStore.mainStore.accountList.find(
            item => item.address === this.store.fromAddress,
        );
        const className = cn(
            'sonm-deposit-withdraw__account',
            this.props.isConfirmation
                ? null
                : 'sonm-deposit-withdraw__account--span',
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
        return (
            <div className="sonm-deposit-withdraw__values">
                <FormField
                    error={this.store.validationAmount}
                    label="Amount"
                    className="sonm-deposit-withdraw__values-amount-input"
                    key="amount"
                >
                    <Input
                        name="amountEther"
                        className="sonm-send__input"
                        onChangeDeprecated={this.handleChangeAmount}
                        placeholder="Amount"
                        value={this.store.userInput.amountEther}
                        readOnly={this.props.isConfirmation}
                    />
                </FormField>
                {this.props.isConfirmation ? null : (
                    <Button
                        key="amount-maximum"
                        color="blue"
                        transparent
                        square
                        onClick={this.handleSetMaximum}
                        className="sonm-deposit-withdraw__values-amount-maximum"
                    >
                        Add maximum
                    </Button>
                )}
                <FormField
                    label="Gas price"
                    error={this.store.validationGasPrice}
                    key="gas-price"
                    className="sonm-deposit-withdraw__values-gas-price"
                >
                    <Input
                        className="sonm-send__input"
                        value={this.store.userInput.gasPriceGwei}
                        onChangeDeprecated={this.handleChangeGasPrice}
                        placeholder={this.store.gasPriceGwei}
                        readOnly={this.props.isConfirmation}
                        name="gasPrice"
                    />
                </FormField>
                <span className="sonm-deposit-withdraw__values-gwei">Gwei</span>
                {this.props.isConfirmation ? null : (
                    <PriorityInput
                        className="sonm-deposit-withdraw__values-priority"
                        valueList={['low', 'normal', 'high']}
                        value={this.store.priority}
                        onChange={this.handleChangePriority}
                        key="gas-price-priority"
                    />
                )}
                <FormField
                    label="Gas limit"
                    error={this.store.validationGasLimit}
                    className="sonm-deposit-withdraw-confirm__values-gas-limit"
                    key="gas-limit"
                >
                    <Input
                        className="sonm-send__input"
                        value={this.store.userInput.gasLimit}
                        onChangeDeprecated={this.handleChangeGasLimit}
                        placeholder={this.store.gasLimit}
                        readOnly={this.props.isConfirmation}
                        name="gasLimit"
                    />
                </FormField>
            </div>
        );
    }

    public renderCommission() {
        const currency = rootStore.mainStore.currencyMap.get(
            this.store.currencyAddress,
        );
        if (!currency) {
            return null;
        }

        return (
            <dl className="sonm-deposit-withdraw__commission">
                <div className="sonm-deposit-withdraw__commission-grid">
                    <div className="sonm-deposit-withdraw__commission-grid-left">
                        <dt>You get</dt>
                        <dd>
                            {this.store.userInput.amountEther} {currency.symbol}
                        </dd>
                    </div>
                    <div className="sonm-deposit-withdraw__commission-grid-right">
                        <dt>SONM commission</dt>
                        <dd>0</dd>
                    </div>
                </div>
            </dl>
        );
    }

    protected renderPasswordConfirmation() {
        return (
            <ConfirmationPanel
                className="sonm-deposit-withdraw__confirmation-panel"
                submitBtnLabel={this.props.title.toUpperCase()}
                onSubmit={
                    rootStore.mainStore.isOffline
                        ? this.handleConfrim
                        : undefined
                }
                onCancel={this.handleCancel}
                validationMessage={this.state.validationPassword}
            />
        );
    }

    public renderButtons() {
        return (
            <div className="sonm-deposit-withdraw__next-button">
                <Button
                    onClick={this.handleSubmit}
                    type="submit"
                    color="violet"
                    disabled={
                        !this.store.isFormValid ||
                        !this.store.hasNecessaryValues
                    }
                >
                    NEXT
                </Button>
            </div>
        );
    }

    protected getCurrency = () =>
        rootStore.mainStore.currencyMap.get(this.store.currencyAddress);

    public render() {
        const { className } = this.props;
        return (
            <div className={cn('sonm-deposit-withdraw', className)}>
                {this.renderAccount()}
                {this.getCurrency() ? this.renderAmount() : null}
                {this.renderCommission()}
                {this.props.isConfirmation
                    ? this.renderPasswordConfirmation()
                    : this.renderButtons()}
            </div>
        );
    }
}
