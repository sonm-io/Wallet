import * as React from 'react';
import { Form, Button, InputNumber, Spin, Input, Select } from 'antd';
import { BigSelect } from 'app/components/common/big-select';
import { AccountItem } from 'app/components/common/account-item';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';

const {Option} = Select;

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
}

@inject('sendStore')
@observer
export class SendSrc extends React.Component<IProps, any> {
    public state = {
        isPending: false,
    };

    public handleSubmit = (event: React.FormEvent<Form>) => {
        this.props.form.validateFields(async (err, {path, password}) => {
            if (err) {
                return;
            }

        });
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
                                    {required: true, message: 'Please select wallet'},
                                ],
                            })(
                                <BigSelect>
                                    <Option value="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28">
                                        <AccountItem
                                            address="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28"
                                            name="Wallet 0x"
                                            etherBalance="5555"
                                            sonmBalance="777"
                                        />
                                    </Option>
                                    <Option value="01602E49e4413Ce46Cd559E86d4c9939e2332B28">
                                        <AccountItem
                                            address="01602E49e4413Ce46Cd559E86d4c9939e2332B28"
                                            name="Wallet1"
                                            etherBalance="1000"
                                            sonmBalance="999"
                                        />
                                    </Option>
                                </BigSelect>,
                            )}
                        </Form.Item>
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
                                        className="sonm-send__input"
                                        placeholder="Address"
                                    />,
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            className="sonm-send__currency-select"
                        >
                            {
                                form.getFieldDecorator('currency', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: 'Please select currency'},
                                    ],
                                })(
                                    <BigSelect/>,
                                )
                            }
                        </Form.Item>
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
                            <Button className="sonm-send__set-max">Add maximum</Button>
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
                                />,
                            )}
                        </Form.Item>
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
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}

export const Send = Form.create()(SendSrc);
