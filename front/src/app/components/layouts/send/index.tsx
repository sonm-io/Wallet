import * as React from 'react';
import { Form, InputNumber, Spin, Input } from 'antd';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { CurrencyBigSelect } from 'app/components/common/currency-big-select';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { Button } from 'app/components/common/button';
import { ButtonGroup } from 'app/components/common/button-group';
import IdentIcon from '../../common/ident-icon/index';

interface IProps extends FormComponentProps {
    className?: string;
    sendStore?: {
        form: {
            from: string,
            to: string,
            amount: string,
            currency: string,
            gasLimit: string,
            gasPrice: string,
        },
    };
    mainStore?: {
    };
}

@inject('sendStore', 'mainStore')
@observer
export class SendSrc extends React.Component<IProps, any> {
    public state = {
        isPending: false,
        addressTarget: '0x',
        priority: 'normal',
    };

    private handleSubmit = (event: React.FormEvent<Form>) => {
        this.props.form.validateFields(async (err, {path, password}) => {
            if (err) {
                return;
            }
        });
    }

    private handleChangeTargetAddress = (event: any) => {
        const value = normalizeAddress(event.target.value);

        if (value !== this.state.addressTarget) {
            this.setState({ addressTarget: value });
        }
    }

    private handleChangeGasPrice = () => {

    }

    public render() {
        const {
            className,
            form,
        } = this.props;

        return (
            <div className={cn('sonm-send', className)}>
                <Spin spinning={this.state.isPending}>
                    <Form onSubmit={this.handleSubmit} className="sonm-send__form">
                        <Form.Item
                            label="From"
                            className="sonm-send__account-select"
                        >
                            {form.getFieldDecorator('from', {
                                initialValue: '0x01602E49e4413Ce46Cd559E86d4c9939e2332B28',
                                rules: [
                                    { required: true, message: 'Please select wallet' },
                                ],
                            })(
                                <AccountBigSelect
                                    returnPrimitive
                                    accounts={[{
                                        address: '0x01602E49e4413Ce46Cd559E86d4c9939e2332B28',
                                        name: 'Wallet1',
                                        etherBalance: '100.0000000000000000001',
                                        sonmBalance: '1232354246535',
                                    }]}
                                />,
                            )}
                        </Form.Item>
                        <div className="sonm-send__form-second-line">
                            <Form.Item
                                label="To"
                                className="sonm-send__target"
                            >
                                {
                                    form.getFieldDecorator('to', {
                                        initialValue: '',
                                        rules: [
                                            {required: true, message: 'Please input quanity'},
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
                                <IdentIcon address={this.state.addressTarget} />
                            </div>
                            <Form.Item
                                className="sonm-send__currency-select"
                            >
                                {
                                    form.getFieldDecorator('currency', {
                                        initialValue: '0x11112E49e4413Ce46Cd559E86d4c9939e2332B28',
                                        rules: [
                                            { required: true, message: 'Please select currency'} ,
                                        ],
                                    })(
                                        <CurrencyBigSelect
                                            returnPrimitive
                                            currencies={[
                                                {
                                                    fullName: 'Ethereum',
                                                    address: '0x11112E49e4413Ce46Cd559E86d4c9939e2332B28',
                                                    symbol: 'ETH',
                                                    amount: '110000000000000000',
                                                },
                                                {
                                                    fullName: 'Sonm',
                                                    address: '0x00002E49e4413Ce46Cd559E86d4c9939e2332B28',
                                                    symbol: 'SNM',
                                                    amount: '11000000000000000000',

                                                },
                                                {
                                                    fullName: 'Scam coin',
                                                    address: '0x55552E49e4413Ce46Cd559E86d4c9939e2332B28',
                                                    symbol: 'SCM',
                                                    amount: '110000000000000000000',
                                                },
                                            ]}
                                        />,
                                    )
                                }
                            </Form.Item>
                        </div>
                        <Form.Item
                            label="Amount"
                            className="sonm-send__currency-amount"
                        >
                            {form.getFieldDecorator('amount', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: 'Please input amount'},
                                ],
                            })(
                                <InputNumber
                                    className="sonm-send__input"
                                    placeholder="Ammount"
                                />,
                            )}
                            <Button
                                className="sonm-send__set-max"
                                color="blue"
                                transparent
                                square
                            >
                                Add maximum
                            </Button>
                        </Form.Item>
                        <Form.Item
                            label="Gas limit"
                            className="sonm-send__gas-limit"
                        >
                            {form.getFieldDecorator('gasPrice', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: 'Please define gas price'},
                                ],
                            })(
                                <InputNumber
                                    className="sonm-send__input"
                                    placeholder="Gas price"
                                    onChange={this.handleChangeGasPrice}
                                />,
                            )}
                        </Form.Item>
                        <div className="sonm-send__last-line">
                            <Form.Item
                                label="Gas price"
                                className="sonm-send__gas-price"
                            >
                                {
                                    form.getFieldDecorator('gasLimit', {
                                        initialValue: '',
                                        rules: [
                                            {required: true, message: 'Please define gas limit'},
                                        ],
                                    })(
                                        <InputNumber
                                            className="sonm-send__input"
                                            placeholder="Gas limit"
                                        />,
                                    )
                                }
                                <ButtonGroup
                                    valueList={['low', 'normal', 'hight']}
                                    value={this.state.priority}
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
            </div>
        );
    }
}

const zzzero = '0000000000000000000000000000000000000000';
function normalizeAddress(str: string): string {
    const s = zzzero + str;
    const l = s.length;

    return s.slice(l - 40, l);
}

export const Send = Form.create()(SendSrc);
