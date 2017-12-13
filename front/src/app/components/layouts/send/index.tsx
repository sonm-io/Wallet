import * as React from 'react';
import { Form, Input } from 'antd';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { CurrencyBigSelect } from 'app/components/common/currency-big-select';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as cn from 'classnames';
import * as BigNumber from 'bignumber.js';
import { inject, observer } from 'mobx-react';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import { IdentIcon } from 'app/components/common/ident-icon';
import { MainStore, ISendFormValues } from 'app/stores/main';
import { Header } from 'app/components/common/header';

interface IProps extends FormComponentProps {
    className?: string;
    mainStore?: MainStore;
    initialCurrency?: string;
    initialAddress?: string;
    onRequireConfirmation: () => void;
}

type PriorityInput = new () => ButtonGroup<string>;
const PriorityInput = ButtonGroup as PriorityInput;

const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/i;

@inject('historyStore', 'mainStore')
@observer
export class SendSrc extends React.Component<IProps, any> {
    public state = {
        addressTarget: '0x',
    };

    public componentWillMount() {
        this.props.initialAddress && this.mainStore.selectAccount(this.props.initialAddress);
        this.props.initialCurrency && this.mainStore.selectCurrency(this.props.initialCurrency);
    }

    protected get mainStore(): MainStore {
        if (!this.props.mainStore) { throw new Error('mainStore is undefined'); }

        return this.props.mainStore;
    }

    protected handleSubmit = (event: React.FormEvent<Form>) => {
        event.preventDefault();

        this.props.form.validateFields(
            { force: true },
            async (err, values: ISendFormValues) => {
                if (err) { return; }

                this.mainStore.setSendParams(values);

                this.props.onRequireConfirmation();
            },
        );
    }

    protected handleChangeAccount = (address: string) => {
        this.mainStore.selectAccount(address);

        this.props.form.validateFields(
            ['toAddress'],
            { force: true },
            Function.prototype as any,
        );
    }

    protected handleChangeCurrency = (address: string) => {

        this.mainStore.selectCurrency(address);
    }

    protected handleSetMaximum = () => {
        const {gasPrice, gasLimit} = this.props.form.getFieldsValue(['gasPrice', 'gasLimit']) as any;
        this.props.form.setFieldsValue({
            amount: this.mainStore.getMaxValue(gasPrice, gasLimit),
        });
    }

    // TODO
    protected handleChangePriority = (value: string) => {
        const [min, max] = this.mainStore.gasPriceThresholds;
        let gasPrice = this.mainStore.averageGasPrice;

        if (value === 'low') {
            gasPrice = min;
        } else if (value === 'high') {
            gasPrice = max;
        }

        this.props.form.setFieldsValue({
            gasPrice,
        });

        this.mainStore.setUserGasPrice(gasPrice);
    }

    protected handleChangeTargetAddress = (event: any) => {
        const value = event.target.value;

        if (value !== this.state.addressTarget) {
            this.setState({ addressTarget: value });
        }
    }

    protected handleChangeGasPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (SendSrc.createBigNumber(value) === undefined) { return; }

        this.mainStore.setUserGasPrice(value);
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

        if (this.mainStore.selectedAccountAddress === value) {
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

    protected static normalizeAddress(str: string): string {
        const s = '0000000000000000000000000000000000000000' + str;
        const l = s.length;

        return s.slice(l - 40, l);
    }

    public render() {
        const {
            className,
            form,
        } = this.props;

        const balanceList = this.mainStore.currentBalanceList;
        const selectedCurrencyAddress = this.mainStore.selectedCurrencyAddress;
        const gasPrice = this.mainStore.userGasPrice;
        const gasLimit = this.mainStore.values.gasLimit || MainStore.DEFAULT_GAS_LIMIT;
        const values = this.mainStore.values;

        return (
            <div className={cn('sonm-send', className)}>
                <Header className="sonm-send__header">
                    Send
                </Header>
                <Form onSubmit={this.handleSubmit} className="sonm-send__form">
                    <Form.Item
                        label="From"
                        className="sonm-send__account-select"
                    >
                        <AccountBigSelect
                            returnPrimitive
                            onChange={this.handleChangeAccount}
                            accounts={this.mainStore.accountList}
                            value={this.mainStore.selectedAccountAddress}
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
                                {this.mainStore.firstToken.symbol}
                            </span>
                            <PriorityInput
                                valueList={['low', 'normal', 'high']}
                                value={this.mainStore.priority}
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
            </div>
        );
    }
}

export const Send = Form.create()(SendSrc);
