import * as React from 'react';
import Input from 'antd/es/input';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { CurrencyBigSelect } from 'app/components/common/currency-big-select';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Form, FormRow, FormField } from 'app/components/common/form';
import { SendStore } from 'app/stores/send';
import { ISendFormValues } from 'app/stores/types';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { withRootStore, Layout, IHasRootStore } from '../layout';

interface IProps extends IHasRootStore {
    className?: string;
    initialCurrency?: string;
    initialAddress?: string;
    onRequireConfirmation: () => void;
    onNotAvailable: () => void;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

class SendLayout extends Layout<IProps> {
    public componentWillMount() {
        const rootStore = this.rootStore;

        if (rootStore.myProfiles.accountAddressList.length === 0) {
            this.props.onNotAvailable();
        }

        if (this.props.initialAddress) {
            rootStore.send.setUserInput({
                fromAddress: this.props.initialAddress,
            });
        }

        if (this.props.initialCurrency) {
            rootStore.send.setUserInput({
                currencyAddress: this.props.initialCurrency,
            });
        }

        this.setState({
            addressTarget: rootStore.send.toAddress,
        });
    }

    protected get sendStore(): SendStore {
        return this.rootStore.send;
    }

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        if (this.rootStore.send.isFormValid) {
            this.props.onRequireConfirmation();
        }
    };

    protected handleChangeFormInput(value: Partial<ISendFormValues>) {
        this.rootStore.send.setUserInput(value);
    }

    protected handleChangeFormInputEvent(
        name: keyof ISendFormValues,
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const value = event.target.value;

        this.handleChangeFormInput({ [name]: value });
    }

    protected handleChangeTargetAddress = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => this.handleChangeFormInputEvent('toAddress', event);

    protected handleChangeAccount = (fromAddress: string) =>
        this.handleChangeFormInput({ fromAddress });

    protected handleChangeCurrency = (currencyAddress: string) =>
        this.handleChangeFormInput({ currencyAddress });

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
        this.rootStore.send.setUserInput({
            amountEther: this.rootStore.send.currentBalanceMaximum,
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

        this.rootStore.send.setUserInput({ gasPriceGwei });
    };

    public render() {
        const { className } = this.props;
        const rootStore = this.rootStore;
        const sendStore = rootStore.send;
        const balanceList = sendStore.currentBalanceList;

        return (
            <div className={cn('sonm-send', className)}>
                <Form onSubmit={this.handleSubmit} className="sonm-send__form">
                    <FormRow className="sonm-send__row-from-address">
                        <FormField
                            className="sonm-send__address-from-field"
                            label="From"
                        >
                            <AccountBigSelect
                                returnPrimitive
                                onChange={this.handleChangeAccount}
                                accounts={rootStore.myProfiles.accountList}
                                value={rootStore.send.fromAddress}
                            />
                        </FormField>
                    </FormRow>

                    <FormRow className="sonm-send__row-to-address">
                        <FormField
                            className="sonm-send__address-to-field"
                            error={sendStore.validationToAddress}
                            label="To"
                        >
                            <Input
                                onChange={this.handleChangeTargetAddress}
                                placeholder="Address"
                                value={sendStore.userInput.toAddress}
                            />
                        </FormField>

                        <IdentIcon
                            onlyGeneratedIcon
                            address={sendStore.toAddress}
                            className="sonm-send__address-to-icon"
                        />

                        <CurrencyBigSelect
                            className="sonm-send__currency-select"
                            returnPrimitive
                            currencies={balanceList}
                            onChange={this.handleChangeCurrency}
                            value={sendStore.currencyAddress}
                        />
                    </FormRow>

                    <FormRow className="sonm-send__row-amount">
                        <FormField
                            error={sendStore.validationAmount}
                            label="Amount"
                        >
                            <Input
                                className="sonm-send__input"
                                onChange={this.handleChangeAmount}
                                autoComplete="off"
                                placeholder="Amount"
                                value={sendStore.userInput.amountEther}
                            />
                        </FormField>

                        <Button
                            className="sonm-send__max-amount-btn"
                            color="blue"
                            transparent
                            square
                            onClick={this.handleSetMaximum}
                        >
                            Add maximum
                        </Button>
                    </FormRow>

                    <FormRow className="sonm-send__row-gas-limit">
                        <FormField
                            label="Gas limit"
                            error={sendStore.validationGasLimit}
                        >
                            <Input
                                className="sonm-send__input"
                                value={sendStore.userInput.gasLimit}
                                onChange={this.handleChangeGasLimit}
                                autoComplete="off"
                                placeholder={sendStore.gasLimit}
                            />
                        </FormField>
                    </FormRow>

                    <FormRow className="sonm-send__row-gas-price">
                        <FormField
                            label="Gas price"
                            error={sendStore.validationGasPrice}
                        >
                            <Input
                                className="sonm-send__input"
                                value={sendStore.userInput.gasPriceGwei}
                                onChange={this.handleChangeGasPrice}
                                autoComplete="off"
                                placeholder={sendStore.gasPriceGwei}
                            />
                        </FormField>

                        <span className="sonm-send__gas-price-unit">Gwei</span>

                        <PriorityInput
                            className="sonm-send__gas-price-buttons"
                            valueList={['low', 'normal', 'high']}
                            value={rootStore.send.priority}
                            onChange={this.handleChangePriority}
                        />
                    </FormRow>

                    <FormRow className="sonm-send__row-submit">
                        <Button
                            onClick={this.handleSubmit}
                            type="submit"
                            color="violet"
                            disabled={
                                !sendStore.isFormValid ||
                                !sendStore.hasNecessaryValues
                            }
                            className="sonm-send__submit"
                        >
                            NEXT
                        </Button>
                    </FormRow>
                </Form>
            </div>
        );
    }
}

export const Send = withRootStore(observer(SendLayout));
