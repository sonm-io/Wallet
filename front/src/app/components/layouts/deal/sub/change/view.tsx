import * as React from 'react';
import * as cn from 'classnames';
import { IBenchmarkMap } from 'app/api/types';
import { PropertyList } from 'app/components/common/property-list';
import { Button } from 'app/components/common/button';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import {
    ConfirmationPanel,
    EnumConfirmationDisplay,
} from 'app/components/common/confirmation-panel';
import * as moment from 'moment';
import formatSeconds from 'app/utils/format-seconds';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { IPropertyItemConfig } from '../../../../common/property-list';

interface IDealData {
    id: string;
    startTime: number;
    endTime: number;
    timeLeft: number;
    blockedBalance: string;
    status: number;
    supplierAddress: string;
    consumerAddress: string;
    duration: number;
    price: string;
}

interface IProps {
    className?: string;
    duration: number;
    price: string;
    totalPayout: string;
    benchmarkMap: IBenchmarkMap;
    marketAccountAddress: string;
    showButtons: boolean;
    propertyList: IDealData;
    onCreateChangeRequest: (password: string) => void;
    onChangeFormInput: (name: string, value: string) => void;
    onShowConfirmationPanel: () => void;
    onHideConfirmationPanel: () => void;
    showConfirmationPanel: boolean;
    validationPassword: string;
    newDuration: string;
    newPrice: string;
}

export class DealChangeRequestView extends React.Component<IProps, never> {
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
            name: 'Price',
            id: 'price',
            renderValue: (value: string) =>
                `${moveDecimalPoint(value, -18, 2)} SNM`,
        },
        {
            name: 'Duration',
            id: 'duration',
            renderValue: (value: number) =>
                value ? formatSeconds(value) : '---',
        },
    ];

    public handleCreateChangeRequest = (password: string) => {
        this.props.onCreateChangeRequest(password);
    };

    protected handleChangeInput = (params: IChangeParams<string>) => {
        this.props.onChangeFormInput(params.name, params.value);
    };

    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-deal-change-request', p.className)}>
                <div className="sonm-deal-change-request__column-left">
                    <div className="sonm-deal-change-request__column-left__details">
                        <h4 className="sonm-deal-change-request__header">
                            Details
                        </h4>
                        <PropertyList
                            data={p.propertyList}
                            config={this.config}
                        />
                    </div>
                </div>
                <div className="sonm-deal-change-request__column-right">
                    {p.showButtons ? (
                        p.showConfirmationPanel ? (
                            <div className="sonm-deal-change-request__column-right__confirmation-panel">
                                <ConfirmationPanel
                                    onSubmit={this.handleCreateChangeRequest}
                                    onCancel={
                                        this.props.onHideConfirmationPanel
                                    }
                                    validationMessage={
                                        this.props.validationPassword
                                    }
                                    displayMode={
                                        EnumConfirmationDisplay.OneLine
                                    }
                                />
                            </div>
                        ) : (
                            <div className="sonm-deal-change-request__column-right__buttons">
                                <Button
                                    type="submit"
                                    color="violet"
                                    onClick={this.props.onShowConfirmationPanel}
                                >
                                    Next
                                </Button>
                            </div>
                        )
                    ) : null}
                    <div className="sonm-deal-change-request__column-right__benchmarks">
                        <h4 className="sonm-deal-change-request__header">
                            Set parameters
                        </h4>
                        <div className="sonm-deal-change-request-input-values">
                            {!p.showConfirmationPanel ? (
                                <React.Fragment>
                                    <div className="sonm-deal-change-request-input-values__label">
                                        New price, USD/h
                                    </div>
                                    <div className="sonm-deal-change-request-input-values__input">
                                        <Input
                                            name="newPrice"
                                            onChange={this.handleChangeInput}
                                            value={this.props.newPrice}
                                        />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className="sonm-deal-change-request-input-values__label">
                                        New price
                                    </div>
                                    <div className="sonm-deal-change-request-input-values__value">
                                        {this.props.newPrice} USD/h
                                    </div>
                                </React.Fragment>
                            )}
                            {p.duration ? (
                                !p.showConfirmationPanel ? (
                                    <React.Fragment>
                                        <div className="sonm-deal-change-request-input-values__label">
                                            New duration, h
                                        </div>
                                        <div className="sonm-deal-change-request-input-values__input">
                                            <Input
                                                name="newDuration"
                                                onChange={
                                                    this.handleChangeInput
                                                }
                                                value={this.props.newDuration}
                                            />
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div className="sonm-deal-change-request-input-values__label">
                                            New duration
                                        </div>
                                        <div className="sonm-deal-change-request-input-values__value">
                                            {this.props.newDuration} h
                                        </div>
                                    </React.Fragment>
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DealChangeRequestView;
