import * as React from 'react';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import { Form, FormRow, FormField } from 'app/components/common/form';
import { SendStore } from 'app/stores/send';
import { rootStore } from 'app/stores';
import { Header } from 'app/components/common/header';
import { ISendFormValues } from 'app/stores/types';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Input } from 'app/components/common/input';

interface IProps {
    className?: string;
    initialCurrency: string;
    initialAddress: string;
    onSuccess: () => void;
    onNotAvailable: () => void;
    action: string;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

@observer
export class DepositWithdraw extends React.Component<IProps, any> {
    public state = {
        validationPassword: '',
        isConfirmation: false,
    };

    public componentWillMount() {
        if (rootStore.mainStore.accountAddressList.length === 0) {
            this.props.onNotAvailable();
        }

        this.store.setUserInput({
            fromAddress: this.props.initialAddress,
        });

        this.store.setUserInput({
            toAddress: this.props.initialAddress,
        });

        this.store.setUserInput({
            currencyAddress: this.props.initialCurrency,
        });
    }

    protected get store(): SendStore {
        return this.props.action === 'deposit'
            ? rootStore.depositStore
            : rootStore.withdrawStore;
    }

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        if (this.store.isFormValid) {
            this.setState({ isConfirmation: true });
        }
    };

    public handleCancel = () => {
        this.store.resetServerValidation();

        if (this.store.isFormValid) {
            this.setState({ isConfirmation: false });
        }
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

    protected handleChangePassword = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => this.handleChangeFormInputEvent('password', event);

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

    public handleConfrim = async (event: any) => {
        const historyStore = rootStore.dwHistoryStore;

        event.preventDefault();

        const password = this.store.userInput.password;

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

    public renderAccount() {
        const fromAddress = this.store.fromAddress;
        const account = rootStore.mainStore.accountMap.get(fromAddress);
        const fromName = account ? account.name : '';

        return (
            <div className="sonm-deposit-withdraw__account">
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
        );
    }

    public renderAmount() {
        const currency = rootStore.mainStore.currencyMap.get(
            this.store.currencyAddress,
        );
        if (!currency) {
            return null;
        }

        const result = [];
        if (this.state.isConfirmation) {
            result.push(
                <div className="sonm-deposit-withdraw__values-amount-input">
                    <dt>Amount</dt>
                    <dd>
                        {this.store.userInput.amountEther} {currency.symbol}
                    </dd>
                </div>,
                <div className="sonm-deposit-withdraw__values-gas-price">
                    <dt>Gas price</dt>
                    <dd>{this.store.userInput.gasPriceGwei} Gwei</dd>
                </div>,
                <div className="sonm-deposit-withdraw__values-gas-limit">
                    <dt>Gas limit</dt>
                    <dd>{this.store.userInput.gasLimit}</dd>
                </div>,
            );
        } else {
            result.push(
                <FormRow className="sonm-deposit-withdraw__values-amount-input">
                    <FormField
                        error={this.store.validationAmount}
                        label="Amount"
                    >
                        <Input
                            className="sonm-send__input"
                            onChange={this.handleChangeAmount}
                            autoComplete="off"
                            placeholder="Amount"
                            value={this.store.userInput.amountEther}
                        />
                    </FormField>
                </FormRow>,
                <Button
                    color="blue"
                    transparent
                    square
                    onClick={this.handleSetMaximum}
                    className="sonm-deposit-withdraw__values-amount-maximum"
                >
                    Add maximum
                </Button>,
                <FormRow className="sonm-deposit-withdraw__values-gas-price">
                    <FormField
                        label="Gas price"
                        error={this.store.validationGasPrice}
                    >
                        <Input
                            className="sonm-send__input"
                            value={this.store.userInput.gasPriceGwei}
                            onChange={this.handleChangeGasPrice}
                            autoComplete="off"
                            placeholder={this.store.gasPriceGwei}
                        />
                    </FormField>

                    <span className="sonm-send__gas-price-unit">Gwei</span>
                </FormRow>,
                <PriorityInput
                    className="sonm-deposit-withdraw__values-priority"
                    valueList={['low', 'normal', 'high']}
                    value={this.store.priority}
                    onChange={this.handleChangePriority}
                />,
                <div className="sonm-deposit-withdraw-confirm__values-gas-limit">
                    <FormRow className="sonm-deposit-withdraw">
                        <FormField
                            label="Gas limit"
                            error={this.store.validationGasLimit}
                        >
                            <Input
                                className="sonm-send__input"
                                value={this.store.userInput.gasLimit}
                                onChange={this.handleChangeGasLimit}
                                autoComplete="off"
                                placeholder={this.store.gasLimit}
                            />
                        </FormField>
                    </FormRow>
                </div>,
            );
        }

        return <div className="sonm-deposit-withdraw__values">{result}</div>;
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

    public renderPasswordConfirmation() {
        return !this.state.isConfirmation ? (
            ''
        ) : (
            <div className="sonm-deposit-withdraw-confirm__password">
                <h2 className="sonm-deposit-withdraw-confirm__password-header">
                    Confirm operation
                </h2>
                <span className="sonm-deposit-withdraw-confirm__password-description">
                    Please, enter password for this account to confirm operation
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
                            type="password"
                            placeholder="Password"
                            value={this.store.userInput.password}
                            onChange={this.handleChangePassword}
                        />
                    </FormField>
                </Form>
            </div>
        );
    }

    public renderGasLimit() {
        const result = !this.state.isConfirmation ? (
            <FormRow className="sonm-deposit-withdraw">
                <FormField
                    label="Gas limit"
                    error={this.store.validationGasLimit}
                >
                    <Input
                        className="sonm-send__input"
                        value={this.store.userInput.gasLimit}
                        onChange={this.handleChangeGasLimit}
                        autoComplete="off"
                        placeholder={this.store.gasLimit}
                    />
                </FormField>
            </FormRow>
        ) : (
            <div>
                <dt>Gas limit</dt>
                <dd>{this.store.userInput.gasPriceGwei}</dd>
            </div>
        );

        return (
            <div className="sonm-deposit-withdraw-confirm__values-gas-limit">
                {result}
            </div>
        );
    }

    public renderButtons() {
        const buttons = !this.state.isConfirmation ? (
            <Button
                onClick={this.handleSubmit}
                type="submit"
                color="violet"
                className="sonm-send__submit"
                disabled={
                    !this.store.isFormValid || !this.store.hasNecessaryValues
                }
            >
                NEXT
            </Button>
        ) : (
            <div>
                <Button
                    className="sonm-send-confirm__button"
                    transparent
                    type="button"
                    onClick={this.handleCancel}
                >
                    Back
                </Button>
                <Button
                    disabled={rootStore.mainStore.isOffline}
                    className="sonm-deposit-withdraw__button"
                    type="submit"
                    color="violet"
                    onClick={this.handleConfrim}
                >
                    {this.props.action}
                </Button>
            </div>
        );
        return (
            <div className="sonm-deposit-withdraw__button-ct">{buttons}</div>
        );
    }

    public render() {
        const { className } = this.props;
        return (
            <div className={cn('sonm-deposit-withdraw', className)}>
                <Header className="sonm-deposit-withdraw__header">
                    {this.props.action}
                </Header>
                {this.renderAccount()}
                {this.renderAmount()}
                {this.renderCommission()}
                {this.renderPasswordConfirmation()}
                {this.renderButtons()}
            </div>
        );
    }
}
