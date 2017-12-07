import * as React from 'react';
import { Form, Spin, Input } from 'antd';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { CurrencyBigSelect } from 'app/components/common/currency-big-select';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as cn from 'classnames';
import * as BigNumber from 'bignumber.js';
import { inject, observer } from 'mobx-react';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import IdentIcon from '../../common/ident-icon/index';
import { MainStore, ISendFormValues } from 'app/stores/main';
import Header from '../../common/header';
import { SendConfirm } from './sub/confirm';
import { navigate } from 'app/router';

interface IProps extends FormComponentProps {
    className?: string;
    mainStore?: MainStore;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/i;

@inject('historyStore', 'mainStore')
@observer
export class SendSrc extends React.Component<IProps, any> {
    public state = {
        addressTarget: '0x',
        pending: false,
    };

    protected handleSubmit = (event: React.FormEvent<Form>) => {
        event.preventDefault();

        this.props.form.validateFields(
            { force: true },
            async (err, values: ISendFormValues) => {
                if (err || this.props.mainStore === undefined) {
                    return;
                }

                this.props.mainStore.setSendParams(values);

                this.props.mainStore.showConfirmDialog();
            },
        );
    }

    protected handleChangeAccount = (address: string) => {
        if (this.props.mainStore === undefined) {
            throw new Error('this.props.mainStore is undefined');
        }

        this.props.mainStore.selectAccount(address);

        this.props.form.validateFields(['toAddress'], { force: true }, Function.prototype as any);
    }

    protected handleChangeCurrency = (address: string) => {
        if (this.props.mainStore === undefined) {
            throw new Error('this.props.mainStore is undefined');
        }

        this.props.mainStore.selectCurrency(address);
    }

    protected handleSetMaximum = () => {
        if (this.props.mainStore) {

            const {gasPrice, gasLimit} = this.props.form.getFieldsValue(['gasPrice', 'gasLimit']) as any;
            this.props.form.setFieldsValue({
                amount: this.props.mainStore.getMaxValue(gasPrice, gasLimit),
            });
        }
    }

    // TODO
    protected handleChangePriority = (value: string) => {
        if (this.props.mainStore) {
            const [min, max] = this.props.mainStore.gasPriceThresholds;
            let gasPrice = this.props.mainStore.averageGasPrice;

            if (value === 'low') {
                gasPrice = min;
            } else if (value === 'high') {
                gasPrice = max;
            }

            this.props.form.setFieldsValue({
                gasPrice,
            });
            this.props.mainStore.setUserGasPrice(gasPrice);
        }
    }

    protected handleChangeTargetAddress = (event: any) => {
        const value = SendSrc.normalizeAddress(event.target.value);

        if (value !== this.state.addressTarget) {
            this.setState({ addressTarget: value });
        }
    }

    protected handleChangeGasPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (SendSrc.createBigNumber(value) === undefined || this.props.mainStore === undefined) {
            return;
        }

        this.props.mainStore.setUserGasPrice(value);
    }

    protected static createBigNumber(value: string) {
        try {
            const bn  = new BigNumber(value);
            return new BigNumber(bn.toFixed(18));
        } catch (e) {
            return undefined;
        }
    }

    protected static validatePositiveInteger(rule: any, value: string, cb: (msg?: string) => void): boolean {
        if (value.indexOf(',') !== -1 || value.indexOf('.') !== -1) {
            cb('Value should be positive integer');
            return false;
        }

        SendSrc.validatePositiveNumber(rule, value, cb);

        return true;
    }

    protected validateTargetAddress = (rule: any, value: string, cb: (msg?: string) => void) => {
        if (value === '') {
            return cb('Please input address');
        }

        if (!ADDRESS_REGEX.test(value)) {
            return cb('Please input correct address');
        }

        if (this.props.mainStore && this.props.mainStore.selectedAccountAddress === value) {
            return cb('No no no');
        }

        cb();
    }

    protected static validatePositiveNumber(rule: any, value: string, cb: (msg?: string) => void): boolean {
        if (value === '') {
            cb('Required value');
            return false;
        }

        const amount = SendSrc.createBigNumber(value);

        if (amount === undefined) {
            cb('Incorrect amount');
            return false;
        }

        if (amount.lessThanOrEqualTo(0)) {
            cb('Value should be positive');
            return false;
        }

        cb();
        return true;
    }

    public renderConfirm() {
        const mainStore = this.props.mainStore;

        if (!mainStore) { return null; }

        const accountAddress = mainStore.selectedAccountAddress;
        const account = mainStore.accountMap.get(accountAddress);
        const accountName = account ? account.name : '';
        const currency = mainStore.currencyMap.get(mainStore.selectedCurrencyAddress);

        if (!currency) { return null; }

        return <SendConfirm
            fromAddress={accountAddress}
            toAddress={mainStore.values.toAddress}
            amount={mainStore.values.amount}
            gasLimit={mainStore.values.gasLimit}
            gasPrice={mainStore.values.gasPrice}
            fromName={accountName}
            currency={currency}
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancelConfirmation}
            passwordValidationMsg={mainStore.validation.password}
        />;
    }

    public handleConfirm = async (password: string) => {
        const mainStore = this.props.mainStore;

        if (!mainStore) { return; }

        this.setState({ pending: true });

        const isPasswordValid = await mainStore.checkSelectedAccountPassword(password);

        if (isPasswordValid) {
            mainStore.confirmTransaction(password);
            mainStore.hideConfirmDialog();
            this.props.form.resetFields();
            navigate({ path: '/oh-yes' });
        }

        this.setState({ pending: false });
    }

    public handleCancelConfirmation = () => {
        const mainStore = this.props.mainStore;

        if (!mainStore) { return; }

        mainStore.hideConfirmDialog();
        mainStore.setValidation({});
    }

    protected static normalizeAddress(str: string): string {
        const s = '0000000000000000000000000000000000000000' + str;
        const l = s.length;

        return s.slice(l - 40, l);
    }

    public render() {
        if (this.props.mainStore === undefined) {
            return null;
        }

        const {
            className,
            form,
            mainStore,
        } = this.props;

        const balanceList = mainStore.currentBalanceList;
        const selectedCurrencyAddress = mainStore.selectedCurrencyAddress;
        const gasPrice = mainStore.userGasPrice;
        const gasLimit = (mainStore.values.gasLimit || MainStore.DEFAULT_GAS_LIMIT);
        const isReady = mainStore.isReady;
        const values = mainStore.values;

        return (
            <div className={cn('sonm-send', className)}>
                {mainStore.isConfirmDialogVisible
                    ? this.renderConfirm()
                    : <Spin spinning={!isReady || this.state.pending}>
                        <Header className="sonm-send__header">
                            Transfer
                        </Header>
                        <Form onSubmit={this.handleSubmit} className="sonm-send__form">
                            <Form.Item
                                label="From"
                                className="sonm-send__account-select"
                            >
                                <AccountBigSelect
                                    returnPrimitive
                                    onChange={this.handleChangeAccount}
                                    accounts={this.props.mainStore.accountList}
                                    value={this.props.mainStore.selectedAccountAddress}
                                />
                            </Form.Item>
                            <div className="sonm-send__form-second-line">
                                <Form.Item
                                    label="To"
                                    className="sonm-send__target"
                                >
                                    {
                                        form.getFieldDecorator('toAddress', {
                                            initialValue: values && values.toAddress,
                                            rules: [
                                                { validator: this.validateTargetAddress },
                                            ],
                                        })(
                                            <Input
                                                onChange={this.handleChangeTargetAddress}
                                                placeholder="Address"
                                            />,
                                        )
                                    }
                                </Form.Item>
                                <div className="sonm-send__target-icon">
                                    <IdentIcon address={this.state.addressTarget}/>
                                </div>
                                <CurrencyBigSelect
                                    className="sonm-send__currency-select"
                                    returnPrimitive
                                    currencies={balanceList}
                                    onChange={this.handleChangeCurrency}
                                    value={selectedCurrencyAddress}
                                />
                            </div>
                            <Form.Item
                                label="Amount"
                                className="sonm-send__currency-amount"
                            >
                                {form.getFieldDecorator('amount', {
                                    initialValue: values && values.amount,
                                    rules: [
                                        { validator: SendSrc.validatePositiveNumber },
                                    ],
                                })(
                                    <Input
                                        className="sonm-send__input"
                                        placeholder="Amount"
                                    />,
                                )}
                                <Button
                                    className="sonm-send__set-max"
                                    color="blue"
                                    transparent
                                    square
                                    onClick={this.handleSetMaximum}
                                >
                                    Add maximum
                                </Button>
                            </Form.Item>
                            <Form.Item
                                label="Gas limit"
                                className="sonm-send__gas-limit"
                            >
                                {form.getFieldDecorator('gasLimit', {
                                    initialValue: gasLimit,
                                    rules: [
                                        { validator: SendSrc.validatePositiveInteger },
                                    ],
                                })(
                                    <Input
                                        className="sonm-send__input"
                                        placeholder="Gas limit"
                                    />,
                                )}
                            </Form.Item>
                            <div className="sonm-send__last-line">
                                <Form.Item
                                    label="Gas price"
                                    className="sonm-send__gas-price"
                                >
                                    {
                                        form.getFieldDecorator('gasPrice', {
                                            initialValue: gasPrice,
                                            rules: [
                                                { validator: SendSrc.validatePositiveNumber },
                                            ],
                                        })(
                                            <Input
                                                className="sonm-send__input"
                                                placeholder="Gas price"
                                                onChange={this.handleChangeGasPrice}
                                            />,
                                        )
                                    }
                                    <span className="sonm-send__input-suffix">
                                        {MainStore.SYMBOL_ETHER}
                                    </span>
                                    <PriorityInput
                                        valueList={['low', 'normal', 'high']}
                                        value={mainStore.priority}
                                        onChange={this.handleChangePriority}
                                    />
                                </Form.Item>
                                <Button
                                    onClick={this.handleSubmit}
                                    type="submit"
                                    color="violet"
                                    className="sonm-send__submit"
                                >
                                    NEXT
                                </Button>
                            </div>
                        </Form>
                    </Spin>
                }
            </div>
        );
    }
}

export const Send = Form.create()(SendSrc);
