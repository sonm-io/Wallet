import * as React from 'react';
import { BigSelect, Option } from '../big-select';
import { AccountItem, IAccount } from '../account-item';

import * as cn from 'classnames';
import { ICurrencyInfo } from 'common/types/currency';

export interface IAccountBigSelectProps {
    className?: string;
    accounts?: IAccount[];
    hideBalance?: boolean;
    primaryTokenInfo: ICurrencyInfo;
    value?: string;
    onChange?: (value: any) => void;
    returnPrimitive?: boolean;
    hasEmptyOption?: boolean;
}

export class AccountBigSelect extends React.PureComponent<
    IAccountBigSelectProps,
    any
> {
    public render() {
        const {
            value,
            accounts,
            hideBalance,
            className,
            hasEmptyOption,
        } = this.props;

        return (
            <BigSelect
                value={value}
                className={cn('sonm-account-big-select', className)}
                dropdownClassName="sonm-account-big-select__dropdown"
                onChange={this.handleChange}
            >
                {(() => {
                    const options = accounts
                        ? accounts.map(account => (
                              <Option
                                  title={account.name}
                                  value={account.address}
                                  key={account.address}
                              >
                                  <AccountItem
                                      account={account}
                                      hideBalance={hideBalance}
                                      primaryTokenInfo={
                                          this.props.primaryTokenInfo
                                      }
                                      className="sonm-account-big-select__option"
                                  />
                              </Option>
                          ))
                        : [];

                    if (hasEmptyOption) {
                        options.push(
                            <Option key="empty" value="">
                                <div className="sonm-account-big-select__option-empty">
                                    All accounts
                                </div>
                            </Option>,
                        );
                    }

                    return options;
                })()}
            </BigSelect>
        );
    }

    protected handleChange = (address: any) => {
        if (this.props.onChange && this.props.accounts) {
            if (this.props.returnPrimitive) {
                this.props.onChange(address as string);
            } else {
                this.props.onChange(
                    this.props.accounts.find(
                        x => (x.address as string) === address,
                    ),
                );
            }
        }
    };
}

export default AccountBigSelect;
