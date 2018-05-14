import * as React from 'react';
import { Icon } from '../icon';
import * as cn from 'classnames';
import { IListHeaderProps } from './types';

export class ListHeader extends React.Component<IListHeaderProps, any> {
    protected getOrderIconName = (orderKey: string) => {
        if (orderKey === this.props.orderBy) {
            return this.props.orderDesc ? 'OrderDesc' : 'OrderAsc';
        }
        return 'OrderAsc';
    };

    protected handleClickOrder = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        const selectedKey = event.currentTarget.value;
        this.props.onChangeOrder(
            selectedKey,
            !(this.props.orderBy === selectedKey && this.props.orderDesc),
        );
    };

    protected handleClickPageLimit = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        const limit = parseInt(event.currentTarget.value);
        limit !== this.props.pageLimit && this.props.onChangeLimit(limit);
    };

    public render() {
        return (
            <div className={cn('list-header', this.props.className)}>
                <div className="list-header__sortings">
                    Sort by:
                    <div className="list-header__sortings-container">
                        {this.props.orderKeys.map(orderKey => (
                            <button
                                key={orderKey}
                                className={cn(
                                    'list-header__sortings-container-item',
                                    {
                                        'list-header__sortings-container-item--selected':
                                            orderKey === this.props.orderBy,
                                    },
                                )}
                                onClick={this.handleClickOrder}
                                value={orderKey}
                            >
                                {orderKey}
                                <Icon
                                    className="list-header__sortings-container-icon"
                                    i={this.getOrderIconName(orderKey)}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="list-header__pageSize">
                    {this.props.pageLimits.map((limit: number) => {
                        return (
                            <button
                                className="list-header__pageSize-button"
                                key={limit}
                                value={limit}
                                onClick={this.handleClickPageLimit}
                            >
                                <span
                                    className={cn(
                                        'list-header__pageSize-button-label',
                                        {
                                            'list-header__pageSize__button__label--selected':
                                                limit === this.props.pageLimit,
                                        },
                                    )}
                                >
                                    {limit}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        onClick={this.props.onRefresh}
                        className="list-header__pageSize-refresh"
                    >
                        <Icon i="Sync" />
                    </button>
                </div>
            </div>
        );
    }
}

export default ListHeader;
export * from './types';
