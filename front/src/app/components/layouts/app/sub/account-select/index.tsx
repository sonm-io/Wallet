import * as React from 'react';
import * as cn from 'classnames';
import {
    DropdownInput,
    IDropdownInputProps,
} from 'app/components/common/dropdown-input';
import { IAccountInfo } from 'app/api/types';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from '../../../../common/hash-view';

interface IMarketAccountSelectProps {
    accounts: Array<IAccountInfo>;
    url: string;
    onChange: (url: string) => void;
    className?: string;
    hidden: boolean;
    value: IAccountInfo;
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
        this.setState({ opened: this.state.opened });
    };

    protected static Item(props: IAccountInfo) {
        return (
            <React.Fragment>
                <IdentIcon
                    className="sonm-market-select-item__icon"
                    address={props.address}
                />
                <Hash
                    className="sonm-market-select-item__addr"
                    hash={props.address}
                />
                <div className="sonm-market-select-item__name">
                    {props.name}
                </div>
                <div className="sonm-market-select-item__balance">{0}</div>
            </React.Fragment>
        );
    }

    public render() {
        const p = this.props;
        const account = p.value;
        const accounts = p.accounts;

        return (
            <DropdownInput
                className={cn({
                    'sonm-market-account--opened': this.state.opened,
                    'sonm-market-account--hidden': this.props.hidden,
                })}
                isExpanded={this.state.opened}
                onButtonClick={this.handleButtonClick}
                onRequireClose={this.handleCloseTopMenu}
                dropdownCssClasses={{
                    root: 'sonm-market-account',
                    button: 'sonm-market-account__button',
                    popup: 'sonm-market-account__popup',
                    expanded: 'sonm-market-account--expanded',
                }}
                valueString={
                    <React.Fragment>
                        <MarketAccountSelect.Item {...account} />
                    </React.Fragment>
                }
            >
                {accounts &&
                    accounts.map((item: IAccountInfo) => (
                        <MarketAccountSelect.Item
                            key={item.address}
                            {...item}
                        />
                    ))}
            </DropdownInput>
        );
    }
}

export default MarketAccountSelect;
