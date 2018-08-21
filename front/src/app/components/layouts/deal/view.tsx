import * as React from 'react';
import * as cn from 'classnames';
import { IBenchmarkMap } from 'app/api/types';
import { Benchmark } from 'app/components/common/benchmark';
import {
    PropertyList,
    IPropertyItemConfig,
} from 'app/components/common/property-list';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { Button } from 'app/components/common/button';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import * as moment from 'moment';
import formatSeconds from 'app/utils/format-seconds';
import { PricePerHour } from 'app/components/common/price-per-hour';
import { ITogglerChangeParams } from 'app/components/common/toggler';
import { ConfirmationDialog } from 'app/components/common/confirmation-dialog';
import { Input } from 'app/components/common/input';
import { Checkbox } from 'app/components/common/checkbox';
import { FormRow, FormField } from 'app/components/common/form';
import { DealActions } from './types';
import { IChangeParams } from 'app/components/common/types';
import { IAccountBrief } from 'common/types/profile';

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
    benchmarkMap: IBenchmarkMap;
    marketAccountAddress: string;
    showButtons: boolean;
    propertyList: IDealData;
    onFinishDealClick: () => void;
    changeRequestList?: React.ReactElement<any>;

    confirmationDialogAction: string;
    confirmationDialogIsBlacklisted: boolean;
    confirmationDialogPassword: string;
    confirmationDialogPrice: string;
    confirmationDialogValidationPassword: string;
    confirmationDialogValidationPrice: string;
    confirmationDialogOnCheckboxChange: (params: ITogglerChangeParams) => void;
    confirmationDialogOnSubmit: () => void;
    confirmationDialogOnCancel: () => void;
    confirmationDialogOnClose: () => void;
    confirmationDialogOnChangePassword: (params: IChangeParams<string>) => void;
    confirmationDialogOnChangeInput: (params: IChangeParams<string>) => void;
    confirmationDialogIsFormValid: boolean;
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

    public render() {
        const p = this.props;
        const action = p.confirmationDialogAction;

        let subheader;
        let confirmationDialogChildren;
        switch (action) {
            case DealActions.finish:
                subheader = 'Finish deal';
                confirmationDialogChildren = (
                    <FormRow className="sonm-deal__blacklist-checkbox">
                        <Checkbox
                            title="Add user to blacklist"
                            name="isBlacklisted"
                            onChange={p.confirmationDialogOnCheckboxChange}
                            value={p.confirmationDialogIsBlacklisted}
                        />
                    </FormRow>
                );
                break;
            case DealActions.cancelChangeRequest:
                subheader = 'Cancel change request';
                break;
            case DealActions.rejectChangeRequest:
                subheader = 'Reject change request';
                break;
            case DealActions.acceptChangeRequest:
                subheader = 'Accept change request';
                break;
            case DealActions.createChangeRequest:
                subheader = 'Create change request';
                break;
            case DealActions.editChangeRequest:
                subheader = 'Edit change request';
                break;
            default:
                subheader = '';
                break;
        }

        let confirmationDialogSubmitDisabled = false;
        if (
            action === DealActions.createChangeRequest ||
            action === DealActions.editChangeRequest
        ) {
            confirmationDialogChildren = (
                <FormRow>
                    <FormField
                        fullWidth
                        label="Price, USD/h"
                        error={p.confirmationDialogValidationPrice}
                        className={cn(
                            'sonm-confirmation-dialog__label',
                            p.confirmationDialogValidationPrice !== ''
                                ? 'sonm-confirmation-dialog__label--error'
                                : '',
                        )}
                    >
                        <Input
                            name="newPrice"
                            autoFocus
                            value={p.confirmationDialogPrice}
                            onChange={p.confirmationDialogOnChangeInput}
                        />
                    </FormField>
                </FormRow>
            );

            // validate form only if additional fields exists
            confirmationDialogSubmitDisabled = !p.confirmationDialogIsFormValid;
        }

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
                        <div className="sonm-deal__column-right__buttons">
                            <Button
                                type="submit"
                                color="violet"
                                onClick={this.props.onFinishDealClick}
                            >
                                Finish Deal
                            </Button>
                        </div>
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
                {p.changeRequestList}
                {p.confirmationDialogAction !== '' ? (
                    <ConfirmationDialog
                        className="change-request-list__confirmation-panel"
                        validationMessage={
                            p.confirmationDialogValidationPassword
                        }
                        password={p.confirmationDialogPassword}
                        onSubmit={p.confirmationDialogOnSubmit}
                        onClose={p.confirmationDialogOnClose}
                        onCancel={p.confirmationDialogOnCancel}
                        onChangePassword={p.confirmationDialogOnChangeInput}
                        labelSubheader={subheader}
                        submitDisabled={confirmationDialogSubmitDisabled}
                    >
                        {confirmationDialogChildren}
                    </ConfirmationDialog>
                ) : null}
            </div>
        );
    }
}
