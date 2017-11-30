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

interface IProps extends FormComponentProps {
    className?: string;
    mainStore?: MainStore;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

@inject('sendStore', 'mainStore')
@observer
export class SendSrc extends React.Component<IProps, any> {
    public state = {
        addressTarget: '0x',
    };

    protected handleSubmit = (event: React.FormEvent<Form>) => {
        event.preventDefault();

        this.props.form.validateFields(async (err, values: ISendFormValues) => {
            if (err || this.props.mainStore === undefined) {
                return;
            }

            this.props.mainStore.setSendParams(values);

            // TODO
            const password = prompt('Password please') || '';
            this.props.mainStore.confirmTransaction(password);
        });
    }

    protected handleChangeAccount = (address: string) => {
        if (this.props.mainStore === undefined) {
            throw new Error('this.props.mainStore is undefined');
        }

        this.props.mainStore.selectAccount(address);
    }

    protected handleChangeCurrency = (address: string) => {
        if (this.props.mainStore === undefined) {
            throw new Error('this.props.mainStore is undefined');
        }

        this.props.mainStore.selectCurrency(address);
    }

    protected handleSetMaximum = () => {
        if (this.props.mainStore) {

            const {gasPrice, gasValue} = this.props.form.getFieldsValue(['gasPrice', 'gasLimit']) as any;
            this.props.form.setFieldsValue({
                amount: this.props.mainStore.getMaxValue(gasPrice, gasValue),
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
            return new BigNumber(value);
        } catch (e) {
            return undefined;
        }
    }

    protected static validateAmount(rule: any, value: string, cb: (msg?: string) => void) {
        if (value === '') {
            return cb('Required value');
        }

        const amount = SendSrc.createBigNumber(value);

        if (amount === undefined) {
            return cb('Incorrect amount');
        }

        if (amount.lessThan(0)) {
            return 'Value should be positive';
        }

        return cb();
    }

    public renderConfirm() {
        return null;
    }

    protected static normalizeAddress(str: string): string {
        const s = '0000000000000000000000000000000000000000' + str;
        const l = s.length;

        return s.slice(l - 40, l);
    }

    public render() {
        const {
            className,
            form,
            mainStore,
        } = this.props;

        const {

        } = mainStore;

        const balanceList = mainStore && mainStore.currentBalanceList;
        const accountList = mainStore && mainStore.accountList;
        const selectedAccountAddress =  mainStore && mainStore.selectedAccountAddress;
        const selectedCurrencyAddress =  mainStore && mainStore.selectedCurrencyAddress;
        const gasPrice =  mainStore && mainStore.userGasPrice;
        const gasLimit =  mainStore && (mainStore.values.gasLimit || MainStore.DEFAULT_GAS_LIMIT);
        const priority = mainStore && mainStore.priority;
        const showConfirmDialog = mainStore && mainStore.showConfirmDialog;
        const isReady = mainStore && mainStore.isReady;
        const values = mainStore && mainStore.values;

        return (
            <div className={cn('sonm-send', className)}>
                {showConfirmDialog
                    ? this.renderConfirm()
                    : <Spin spinning={!isReady}>
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
                                    accounts={accountList}
                                    value={selectedAccountAddress}
                                />,
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
                                                {required: true, message: 'Please input address'},
                                                {
                                                    pattern: /^(0x)?[0-9a-fA-F]{40}$/i,
                                                    message: 'Please input correct address',
                                                },
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
                                        { validator: SendSrc.validateAmount },
                                    ],
                                })(
                                    <Input
                                        className="sonm-send__input"
                                        placeholder="Ammount"
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
                                        { validator: SendSrc.validateAmount },
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
                                                { validator: SendSrc.validateAmount },
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
                                        value={priority}
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
