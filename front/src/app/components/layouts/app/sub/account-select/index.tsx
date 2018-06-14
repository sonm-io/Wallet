import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from 'app/components/common/dropdown-input';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Balance } from 'app/components/common/balance-view';

export interface IAccount {
    name: string;
    address: string;
    usdBalance: string;
    marketBalance: string;
}

export interface IMarketAccountSelectProps {
    accounts: Array<IAccount>;
    onChange: (account: IAccount) => void;
    className?: string;
    value?: IAccount;
}

export interface IMarketAccountSelectItemProps extends IAccount {
    className?: string;
    onClick?: (account: IAccount) => void;
}

export class MarketAccountSelect extends React.PureComponent<
    IMarketAccountSelectProps,
    any
> {
    public state = {
        opened: false,
    };

    protected handleCloseTopMenu = () => {
        this.setState({ opened: false });
    };

    protected handleButtonClick = () => {
        this.setState({ opened: !this.state.opened });
    };

    protected static Item = class extends React.PureComponent<
        IMarketAccountSelectItemProps,
        never
    > {
        protected handleClick = (event: any) => {
            if (this.props.onClick) {
                this.props.onClick(this.props);
            }
        };

        public render() {
            const p = this.props;
            const Tag = p.onClick ? 'button' : 'div';

            return (
                <Tag
                    className={cn('sonm-market-select-item', p.className)}
                    onClick={this.handleClick}
                >
                    <IdentIcon
                        sizePx={18}
                        className="sonm-market-select-item__icon"
                        address={p.address}
                    />
                    <div className="sonm-market-select-item__name">
                        {p.name}
                    </div>
                    <div className="sonm-market-select-item__balance">
                        <Balance
                            balance={p.usdBalance}
                            decimalPointOffset={18}
                            decimalDigitAmount={2}
                            symbol="USD"
                        />
                        (<Balance
                            balance={p.marketBalance}
                            decimalPointOffset={18}
                            decimalDigitAmount={2}
                            symbol="SNM"
                        />)
                    </div>
                </Tag>
            );
        }
    };

    protected handleSelectAccount = (account: IAccount) => {
        this.props.onChange(account);

        this.setState({ opened: false });
    };

    public render() {
        const p = this.props;
        const account = p.value;
        const accounts = p.accounts;

        if (!account) {
            return null;
        }

        return (
            <DropdownInput
                className={cn(p.className, 'sonm-market-account', {
                    'sonm-market-account--opened': this.state.opened,
                })}
                isExpanded={this.state.opened}
                onButtonClick={this.handleButtonClick}
                onRequireClose={this.handleCloseTopMenu}
                dropdownCssClasses={{
                    root: 'sonm-market-account__wrapper',
                    button: 'sonm-market-account__button',
                    popup: 'sonm-market-account__popup',
                    expanded: 'sonm-market-account--expanded',
                }}
                valueString={
                    <React.Fragment>
                        <div className="sonm-market-account__title">
                            Market account
                        </div>
                        <MarketAccountSelect.Item {...account} />
                    </React.Fragment>
                }
            >
                {accounts &&
                    accounts.map((item: IAccount) => (
                        <MarketAccountSelect.Item
                            className="sonm-market-account__select-item"
                            onClick={this.handleSelectAccount}
                            key={item.address}
                            {...item}
                        />
                    ))}
            </DropdownInput>
        );
    }
}

export default MarketAccountSelect;
