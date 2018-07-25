import * as React from 'react';
import * as cn from 'classnames';
import {
    IAccountBrief,
    IBenchmarkMap,
    IDealChangeRequest,
    TChangeRequestAction,
} from 'app/api/types';
import { Benchmark } from 'app/components/common/benchmark';
import {
    PropertyList,
    IPropertyItemConfig,
} from 'app/components/common/property-list';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { Button } from 'app/components/common/button';
import { Checkbox } from 'app/components/common/checkbox';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';
import { ITogglerChangeParams } from 'app/components/common/toggler';
import * as moment from 'moment';
import formatSeconds from 'app/utils/format-seconds';
import { PricePerHour } from 'app/components/common/price-per-hour';
import { ChangeRequestList } from './sub/change-request-list/index';
import { EnumOrderSide } from 'app/api';

interface IDealData {
    id: string;
    startTime: number;
    endTime: number;
    timeLeft: number;
    blockedBalance: string;
    status: number;
    supplierAddress: string;
    consumerAddress: string;
}

interface IProps {
    className?: string;
    supplier: IAccountBrief;
    consumer: IAccountBrief;
    duration: number;
    price: string;
    totalPayout: string;
    changeRequests?: Array<IDealChangeRequest>;
    benchmarkMap: IBenchmarkMap;
    marketAccountAddress: string;
    showButtons: boolean;
    propertyList: IDealData;
    onFinishDeal: (password: string) => void;
    onShowConfirmationPanel: () => void;
    onHideConfirmationPanel: () => void;
    onChangeCheckbox: (value: ITogglerChangeParams) => void;
    showConfirmationPanel: boolean;
    validationPassword: string;
    isBlacklisted: boolean;

    mySide: EnumOrderSide;
    onChangeRequestCreate: () => void;
    onChangeRequestCancel: TChangeRequestAction;
    onChangeRequestChange: TChangeRequestAction;
    onChangeRequestReject: TChangeRequestAction;
    onChangeRequestAccept: TChangeRequestAction;
    onChangeRequestSubmit: (password: string) => void;
    onChangeRequestConfirmationCancel: () => void;
    changeRequestShowConfirmationPanel: boolean;
}

export class DealView extends React.Component<IProps, never> {
    private config: Array<IPropertyItemConfig<IDealData>> = [
        {
            name: 'Deal ID',
            id: 'id',
        },
        {
            name: 'Deal status',
            id: 'status',
            renderValue: (value: string) => (value ? 'Active' : 'Close'),
        },
        {
            name: 'Start',
            id: 'startTime',
            renderValue: (value: string) =>
                moment.unix(parseInt(value, 10)).format('D MMM YYYY | H:mm'),
        },
        {
            name: 'Finish',
            id: 'endTime',
            renderValue: (value: any) =>
                value
                    ? moment
                          .unix(parseInt(value, 10))
                          .format('D MMM YYYY | H:mm')
                    : '---',
        },
        {
            name: 'Time left',
            id: 'timeLeft',
            renderValue: (value: number) =>
                value ? `${formatSeconds(value)} left` : '---',
        },
        {
            name: 'Type',
            id: 'consumerAddress',
            renderValue: (value: string) =>
                this.props.marketAccountAddress.toLowerCase() ===
                value.toLowerCase()
                    ? 'Buy'
                    : 'Sell',
        },
        {
            name: 'Executed payment',
            id: 'blockedBalance',
            renderValue: (value: string) =>
                `${moveDecimalPoint(value, -18, 2)} SNM`,
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
                            data={p.propertyList}
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
                        <Benchmark
                            data={p.benchmarkMap}
                            ids={Benchmark.detailsPanelIds}
                            names={Benchmark.detailsPanelNames}
                        />
                    </div>
                    <div className="sonm-deal__price-duration">
                        <h4 className="sonm-deal__header">
                            Price and duration
                        </h4>
                        <PricePerHour
                            className="sonm-deal__price"
                            usdWeiPerSeconds={p.price}
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

                {p.showButtons ? (
                    <ChangeRequestList
                        className="sonm-deal__change_request"
                        requests={p.changeRequests || []}
                        dealParams={{
                            price: p.price,
                            duration: p.duration,
                        }}
                        mySide={p.mySide}
                        onCreateRequest={p.onChangeRequestCreate}
                        onCancelRequest={p.onChangeRequestCancel}
                        onChangeRequest={p.onChangeRequestChange}
                        onRejectRequest={p.onChangeRequestReject}
                        onAcceptRequest={p.onChangeRequestAccept}
                        onSubmit={p.onChangeRequestSubmit}
                        onConfirmationCancel={
                            p.onChangeRequestConfirmationCancel
                        }
                        showConfirmation={p.changeRequestShowConfirmationPanel}
                        validationMessage={this.props.validationPassword}
                    />
                ) : null}
            </div>
        );
    }
}

export default DealView;
