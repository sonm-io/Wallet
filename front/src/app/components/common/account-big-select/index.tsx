import * as React from 'react';
import { BigSelect, Option } from '../big-select';
import { AccountItem, IAccountItemProps } from '../account-item';

import * as cn from 'classnames';

export interface IAccountBigSelectProps {
    className?: string;
    accounts: IAccountItemProps[];
    value: string;
    onChange?: (value: any) => void;
}

export class AccountBigSelect extends React.Component<IAccountBigSelectProps, any> {
    public render() {
        const {
            value,
            accounts,
            className,
        } = this.props;

        return (
            <BigSelect
                value={value}
                className={cn("sonm-account-big-select", className)}
                dropdownClassName="sonm-account-big-select__dropdown"
                onChange={this.handleChange}
            >
                {
                    accounts.map(account => {
                        return (
                            <Option value={account.address}>
                                <AccountItem {...account} />
                            </Option>
                        );
                    })
                }
            </BigSelect>
        );
    }

    protected handleChange(address: string) {
        if (this.props.onChange) {
            this.props.onChange(this.props.accounts.find(x => x.address === address));
        }
    }
}
