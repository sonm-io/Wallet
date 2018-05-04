import * as React from 'react';
import { Icon } from '../icon';
import * as cn from 'classnames';

export interface IListHeaderProps {
    orderBy: string;
    orderKeys: Array<string>;
    desc: boolean;
    limit: number;
    limits: Array<number>;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
}

export class ListHeader extends React.Component<IListHeaderProps, any> {
    constructor(props: IListHeaderProps) {
        super(props);
    }

    protected getOrderIconName = (orderKey: string) => {
        if (orderKey === this.props.orderBy) {
            return this.props.desc ? 'OrderDesc' : 'OrderAsc';
        }
        return 'OrderAsc';
    };

    protected handleClickOrder(selectedKey: string) {
        this.props.onChangeOrder(
            selectedKey,
            !(this.props.orderBy === selectedKey && this.props.desc),
        );
    }

    public render() {
        return (
            <div className="list-header">
                <div className="list-header__sortings">
                    Sort by:
                    <div className="list-header__sortings__container">
                        {this.props.orderKeys.map(orderKey => (
                            <div
                                key={orderKey}
                                className={cn(
                                    'list-header__sortings__container__item',
                                    {
                                        'list-header__sortings__container__item--selected':
                                            orderKey === this.props.orderBy,
                                    },
                                )}
                                onClick={() => this.handleClickOrder(orderKey)}
                            >
                                {orderKey}
                                <Icon
                                    className="list-header__sortings__container__icon"
                                    i={this.getOrderIconName(orderKey)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="list-header__pageSize">
                    {this.props.limits.map(i => (
                        <div
                            key={i}
                            className={cn('list-header__pageSize__item', {
                                'list-header__pageSize__item--selected':
                                    i === this.props.limit,
                            })}
                            onClick={() =>
                                i !== this.props.limit &&
                                this.props.onChangeLimit(i)
                            }
                        >
                            {i}
                        </div>
                    ))}
                    <Icon
                        i="Sync"
                        className="list-header__pageSize__sync-icon"
                        onClick={this.props.onRefresh}
                    />
                </div>
            </div>
        );
    }
}
