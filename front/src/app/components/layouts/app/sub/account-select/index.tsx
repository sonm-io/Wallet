import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from 'app/components/common/dropdown-input';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';

export interface IAccount {
    name: string;
    address: string;
    usdBalance: string;
    snmBalance: string;
}

export interface IMarketAccountSelectProps {
    accounts: Array<IAccount>;
    url: string;
    onChange: (url: string) => void;
    className?: string;
    hidden: boolean;
    value: IAccount;
}

export interface IMarketAccountSelectItemProps extends IAccount {
    className?: string;
    usdMultiplier?: string;
    onClick?: (account: IAccount) => void;
}

export class MarketAccountSelect extends React.PureComponent<
    IMarketAccountSelectProps,
    any
> {
    public state = {
        opened: false,
    };

    protected handleClickUrl = (event: any) => {
        const path = event.target.value;

        this.props.onChange(path);
    };

    protected handleCloseTopMenu = () => {
        this.setState({ opened: '' });
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
                    <Hash
                        className="sonm-market-select-item__addr"
                        hash={p.address}
                    />
                    <div className="sonm-market-select-item__name">
                        {p.name}
                    </div>
                    <div className="sonm-market-select-item__balance">
                        {p.usdBalance} USD ({p.snmBalance} SNM)
                    </div>
                </Tag>
            );
        }
    };

    protected handleSelectAccount = (account: IAccount) => {};

    public render() {
        const p = this.props;
        const account = p.value;
        const accounts = p.accounts;

        return (
            <DropdownInput
                className={cn('sonm-market-account', {
                    'sonm-market-account--opened': this.state.opened,
                    'sonm-market-account--hidden': this.props.hidden,
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
