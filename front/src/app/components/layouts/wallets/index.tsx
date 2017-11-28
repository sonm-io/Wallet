import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import Button from '../../common/button/index';
import AccountItem from '../../common/account-item/index';
import CurrencyBalanceList from '../../common/currency-balance-list/index';
import DeletableItem from './sub/deletable-item/index';
import Header from '../../common/header';

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

@inject('mainStore')
@observer
export class Wallets extends React.Component<IProps, any> {
    public state = {
        deleteAddress: '',
    }

    private handleClose(deleteAddress: string) {
        // this.setState({ deleteAddress });
        // this.props.mainStore.deleteAccount(deleteAddress);
    }

    public render() {
        const {
            className,
            mainStore,
        } = this.props;

        if (mainStore === undefined) {
            return;
        }

        return (
            <div className={cn('sonm-wallets', className)}>
                <Header className="sonm-wallets__header">
                    Accounts
                </Header>
                <div className="sonm-wallets__list">
                    {mainStore.accountList.map(x => {
                        return (
                            <DeletableItem
                                className="sonm-wallets__list-item"
                                onClose={this.handleClose}
                                key={x.address}
                                id={x.address}
                            >
                                <AccountItem {...x} />
                            </DeletableItem>
                        );
                    })}
                </div>
                <Button className="sonm-wallets__add-button">+ Add wallet</Button>
                <CurrencyBalanceList
                    className="sonm-wallets__balances"
                    currencyBalanceList={mainStore.currentBalanceList}
                />
            </div>
        );
    }
}
