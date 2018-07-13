import * as React from 'react';
import { IDeal, EnumDealStatus } from 'app/api/types';
import ProfileBrief from 'app/components/common/profile-brief';
import Benchmark from 'app/components/common/benchmark';
import { Balance } from 'app/components/common/balance-view';
import formatSeconds from 'app/utils/format-seconds';
import {
    PropertyList,
    IPropertyItemConfig,
} from 'app/components/common/property-list';
import * as moment from 'moment';
import * as cn from 'classnames';
import { BalanceUtils } from 'app/components/common/balance-view/utils';
import { getPricePerHour } from 'app/components/common/price-per-hour/utils';

interface IDealListItem {
    deal: IDeal;
    buyOrSell: 'buy' | 'sell';
    pendingChangeExists?: boolean;
    onClick?: (dealId: string) => void;
}

interface IFromToData {
    from: number;
    to: number;
}

export class DealListItem extends React.Component<IDealListItem, never> {
    protected static readonly dash = (
        <span className="deal-list-item__dash">&mdash;&mdash;</span>
    );

    protected static formatFromTo = (value: number) =>
        value === 0
            ? DealListItem.dash
            : moment.unix(value).format('HH:mm:ss | DD MMM YYYY');

    protected static fromToConfig: IPropertyItemConfig<IFromToData>[] = [
        {
            id: 'from',
            name: 'From:',
            renderValue: DealListItem.formatFromTo,
        },
        {
            id: 'to',
            name: 'To:',
            renderValue: DealListItem.formatFromTo,
        },
    ];

    protected getTimeLeft = () => {
        const deal = this.props.deal;
        return deal.status === EnumDealStatus.Closed
            ? `Deal is finished (${formatSeconds(deal.duration)} total)`
            : deal.timeLeft
                ? `${formatSeconds(deal.timeLeft)} left`
                : 'Spot deal';
    };

    protected handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (this.props.onClick) {
            this.props.onClick(event.currentTarget.dataset.dealId || '');
        }
    };

    public render() {
        const p = this.props;
        const fromTo: IFromToData = {
            from: p.deal.startTime,
            to: p.deal.endTime,
        };
        const classes = cn(
            'deal-list-item',
            p.deal.status === EnumDealStatus.Closed
                ? 'deal-list-item--finished'
                : null,
        );
        const price = BalanceUtils.formatBalance(
            getPricePerHour(p.deal.price),
            4,
            18,
            true,
        );
        const totalPayout = BalanceUtils.formatBalance(
            p.deal.totalPayout,
            4,
            18,
            true,
        );
        return (
            <a
                className={classes}
                data-deal-id={p.deal.id}
                onClick={this.handleClick}
            >
                <ProfileBrief
                    className="deal-list-item__profile"
                    profile={p.deal.supplier}
                    showBalances={false}
                    logoSizePx={50}
                />
                <div className="deal-list-item__buysell">
                    {p.buyOrSell.toUpperCase()}
                </div>
                {p.pendingChangeExists === true ? (
                    <div className="deal-list-item__pending">
                        Pending change exists
                    </div>
                ) : null}
                <div className="deal-list-item__cost">
                    {p.deal.status !== EnumDealStatus.Closed ? (
                        <Balance
                            className="deal-list-item__blocked-balance"
                            balance={p.deal.blockedBalance}
                            decimalDigitAmount={4}
                            decimalPointOffset={18}
                            symbol="SNM"
                            round
                        />
                    ) : null}
                    <div className="deal-list-item__price">
                        {price} USD/h ({totalPayout} USD total)
                    </div>
                    <div className="deal-list-item__time-left">
                        {this.getTimeLeft()}
                    </div>
                    {p.deal.benchmarkMap.networkIncoming === true ? (
                        <div className="deal-list-item__public-ip">
                            public IP
                        </div>
                    ) : null}
                </div>
                <Benchmark
                    className="deal-list-item__benchmarks"
                    data={p.deal.benchmarkMap}
                    ids={Benchmark.gridItemIds}
                    names={Benchmark.gridItemNames}
                />
                <PropertyList
                    className="deal-list-item__fromto"
                    data={fromTo}
                    config={DealListItem.fromToConfig}
                />
            </a>
        );
    }
}
