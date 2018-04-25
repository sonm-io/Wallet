import * as React from 'react';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import { Form, FormField } from 'app/components/common/form';
import { SendStore } from 'app/stores/send';
import { rootStore } from 'app/stores';
import { Header } from 'app/components/common/header';
import { ISendFormValues } from 'app/stores/types';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { AccountItem } from 'app/components/common/account-item';
import { Input } from 'app/components/common/input';

interface IProps {
    className?: string;
    initialCurrency: string;
    initialAddress: string;
    onSuccess: () => void;
    onNotAvailable: () => void;
    onConfirm: () => void;
    onBack: () => void;
    action: string;
    isConfirmation: boolean;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

@observer
export class DepositWithdraw extends React.Component<IProps, any> {
    public state = {
        validationPassword: '',
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
        this.props.onConfirm();
    };

    public handleCancel = () => {
        //this.store.resetServerValidation();
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
        event.preventDefault();

        const password = this.store.userInput.password;

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
        const className = `sonm-deposit-withdraw__account${
            !this.props.isConfirmation ? '--span' : ''
        }`;

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
        const currency = rootStore.mainStore.currencyMap.get(
            this.store.currencyAddress,
        );
        if (!currency) {
            return null;
        }

        const result = [];
        result.push(
            <FormField
                error={this.store.validationAmount}
                label="Amount"
                className="sonm-deposit-withdraw__values-amount-input"
                key="amount"
            >
                <Input
                    className="sonm-send__input"
                    onChange={this.handleChangeAmount}
                    autoComplete="off"
                    placeholder="Amount"
                    value={this.store.userInput.amountEther}
                    readOnly={this.props.isConfirmation}
                />
            </FormField>,
            this.props.isConfirmation ? null : (
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
            ),
            <FormField
                label="Gas price, Gwei"
                error={this.store.validationGasPrice}
                key="gas-price"
                className="sonm-deposit-withdraw__values-gas-price"
            >
                <Input
                    className="sonm-send__input"
                    value={this.store.userInput.gasPriceGwei}
                    onChange={this.handleChangeGasPrice}
                    autoComplete="off"
                    placeholder={this.store.gasPriceGwei}
                    readOnly={this.props.isConfirmation}
                />
            </FormField>,
            this.props.isConfirmation ? null : (
                <PriorityInput
                    className="sonm-deposit-withdraw__values-priority"
                    valueList={['low', 'normal', 'high']}
                    value={this.store.priority}
                    onChange={this.handleChangePriority}
                    key="gas-price-priority"
                />
            ),
            <FormField
                label="Gas limit"
                error={this.store.validationGasLimit}
                className="sonm-deposit-withdraw-confirm__values-gas-limit"
                key="gas-limit"
            >
                <Input
                    className="sonm-send__input"
                    value={this.store.userInput.gasLimit}
                    onChange={this.handleChangeGasLimit}
                    autoComplete="off"
                    placeholder={this.store.gasLimit}
                    readOnly={this.props.isConfirmation}
                />
            </FormField>,
        );

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
        return !this.props.isConfirmation ? (
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

    public renderButtons() {
        const buttons = !this.props.isConfirmation ? (
            <Button
                onClick={this.handleSubmit}
                type="submit"
                color="violet"
                disabled={
                    !this.store.isFormValid || !this.store.hasNecessaryValues
                }
            >
                NEXT
            </Button>
        ) : (
            <React.Fragment>
                <Button transparent type="button" onClick={this.handleCancel}>
                    BACK
                </Button>
                <Button
                    disabled={rootStore.mainStore.isOffline}
                    type="submit"
                    color="violet"
                    onClick={this.handleConfrim}
                    className="sonm-deposit-withdraw__button--action"
                >
                    {this.props.action.toUpperCase()}
                </Button>
            </React.Fragment>
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
