import * as React from 'react';
import * as cn from 'classnames';
import { IAccountBrief, IBenchmarkMap } from 'app/api/types';
import { Benchmark } from 'app/components/common/benchmark';
import { PropertyList } from 'app/components/common/property-list';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { Button } from 'app/components/common/button';
import { Balance } from 'app/components/common/balance-view';
import { Checkbox } from 'app/components/common/checkbox';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';
import { ITogglerChangeParams } from '../../common/toggler';
import * as moment from 'moment';
import formatSeconds from 'app/utils/format-seconds';

interface IProps {
    className?: string;
    supplier: IAccountBrief;
    consumer: IAccountBrief;
    duration: number;
    price: string;
    totalPayout: string;
    benchmarkMap: IBenchmarkMap;
    marketAccountAddress: string;
    showButtons: boolean;
    propertyList: {
        id: string;
        startTime: number;
        endTime: number;
        timeLeft: number;
        blockedBalance: string;
        status: number;
        supplierAddress: string;
        consumerAddress: string;
    };
    onFinishDeal: (password: string) => void;
    onShowConfirmationPanel: () => void;
    onHideConfirmationPanel: () => void;
    onChangeCheckbox: (value: ITogglerChangeParams) => void;
    showConfirmationPanel: boolean;
    validationPassword: string;
    isBlacklisted: boolean;
}

export class DealView extends React.Component<IProps, never> {
    private config = [
        {
            name: 'Deal ID',
            key: 'id',
        },
        {
            name: 'Deal status',
            key: 'status',
            render: (value: string) => (value ? 'Active' : 'Close'),
        },
        {
            name: 'Start',
            key: 'startTime',
            render: (value: string) =>
                moment.unix(parseInt(value, 10)).format('D MMM YYYY | H:mm'),
        },
        {
            name: 'Finish',
            key: 'endTime',
            render: (value: any) =>
                value
                    ? moment
                          .unix(parseInt(value, 10))
                          .format('D MMM YYYY | H:mm')
                    : '---',
        },
        {
            name: 'Time left',
            key: 'timeLeft',
            render: (value: number) =>
                value ? `${formatSeconds(value)} left` : '---',
        },
        {
            name: 'Type',
            key: 'consumerAddress',
            render: (value: string) =>
                this.props.marketAccountAddress.toLowerCase() ===
                value.toLowerCase()
                    ? 'Buy'
                    : 'Sell',
        },
        {
            name: 'Executed payment',
            key: 'blockedBalance',
            render: (value: string) => `${moveDecimalPoint(value, -18, 2)} SNM`,
        },
    ];

    public handleFinishDeal = (password: string) => {
        this.props.onFinishDeal(password);
    };

    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-deal', p.className)}>
                <div className="sonm-deal__column-left">
                    <div className="sonm-deal__column-left__consumer">
                        <h4 className="sonm-deal__header">Consumer</h4>
                        <ProfileBrief
                            profile={p.consumer}
                            showBalances={false}
                        />
                    </div>
                    <div className="sonm-deal__colum-left__supplier">
                        <h4 className="sonm-deal__header">Supplier</h4>
                        <ProfileBrief
                            profile={p.supplier}
                            showBalances={false}
                        />
                    </div>
                    <div className="sonm-deal__column-left__details">
                        <h4 className="sonm-deal__header">Details</h4>
                        <PropertyList
                            dataSource={p.propertyList}
                            config={this.config}
                        />
                    </div>
                </div>
                <div className="sonm-deal__column-right">
                    {p.showButtons ? (
                        p.showConfirmationPanel ? (
                            <div className="sonm-deal__column-right__confirmation-panel">
                                <ConfirmationPanel
                                    onSubmit={this.handleFinishDeal}
                                    onCancel={
                                        this.props.onHideConfirmationPanel
                                    }
                                    validationMessage={
                                        this.props.validationPassword
                                    }
                                />
                                <div className="sonm-deal__column-right__blacklist-checkbox">
                                    <Checkbox
                                        title="Add user to blacklist"
                                        titleBefore
                                        name="isBlacklisted"
                                        onChange={this.props.onChangeCheckbox}
                                        value={this.props.isBlacklisted}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="sonm-deal__column-right__buttons">
                                <Button
                                    type="submit"
                                    color="violet"
                                    onClick={this.props.onShowConfirmationPanel}
                                >
                                    Finish Deal
                                </Button>
                            </div>
                        )
                    ) : null}
                    <div className="sonm-deal__column-right__benchmarks">
                        <h4 className="sonm-deal__header">
                            Resource parameters
                        </h4>
                        <Benchmark data={p.benchmarkMap} />
                    </div>
                    <div className="sonm-deal__price-duration">
                        <h4 className="sonm-deal__header">
                            Price and duration
                        </h4>
                        <Balance
                            className="sonm-deal__price"
                            balance={p.price}
                            decimalPointOffset={18}
                            decimalDigitAmount={4}
                            symbol="USD/h"
                            round
                        />
                        <div className="sonm-deal__duration">
                            {p.duration ? (
                                <React.Fragment>
                                    {formatSeconds(p.duration)}
                                </React.Fragment>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DealView;
