import * as React from 'react';
import * as cn from 'classnames';
import { Checkbox } from 'app/components/common/checkbox';
import { Input } from 'app/components/common/input';
import { Button } from 'app/components/common/button';
import { IOrderFilterPanelProps } from './types';
import { IOrderFilter } from 'app/stores/order-filter';
import { RadioButtonGroup } from 'app/components/common/radio-button-group';
import { FormField } from 'app/components/common/form';
// import { ToggleButtonGroup } from 'app/components/common/toggle-button-group';
import { IChangeParams } from 'app/components/common/types';
import ToggleGroup from 'app/components/common/toggle-group/index';

export class OrderFilterPanel extends React.PureComponent<
    IOrderFilterPanelProps,
    never
> {
    constructor(props: IOrderFilterPanelProps) {
        super(props);
    }

    protected handleChangeInput = (params: IChangeParams<boolean | string>) => {
        const key = params.name as keyof IOrderFilter;
        const value: IOrderFilter[keyof IOrderFilter] = params.value;
        this.props.onUpdateFilter(key, value);
    };

    private static orderTypeValues = ['Sell', 'Buy'];

    // private static orderOwnerTypeValues = [
    //     EnumOrderOwnerType.market,
    //     EnumOrderOwnerType.my,
    // ];
    //
    // private static orderOwnerTypeTitles = ['market orders', 'my orders'];

    protected isFormValid(validation: any) {
        return (
            Object.keys(validation)
                .map(x => validation[x])
                .filter(Boolean).length > 0
        );
    }

    public render() {
        const p = this.props;

        return (
            <div className={cn('order-filter-panel', p.className)}>
                {/*<ToggleButtonGroup*/}
                {/*cssClasses={ToggleGroup.fullWidthCssClasses}*/}
                {/*className="order-filter-panel__order-owner"*/}
                {/*name="owner"*/}
                {/*value={p.orderOwnerType}*/}
                {/*values={OrderFilterPanel.orderOwnerTypeValues}*/}
                {/*titlesOrDisplayIndex={OrderFilterPanel.orderOwnerTypeTitles}*/}
                {/*onChange={this.handleClickOrderOwnerType}*/}
                {/*/>*/}
                <div className="order-filter-panel__filters">
                    <FormField
                        className="order-filter-panel__address"
                        error={p.validation.creatorAddress}
                        label="Creator address"
                    >
                        <Input
                            name="creatorAddress"
                            value={p.creatorAddress}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        label="Type"
                        className="order-filter-panel__order-side"
                    >
                        <RadioButtonGroup
                            cssClasses={ToggleGroup.radioRowCssClasses}
                            name="side"
                            value={p.side}
                            values={OrderFilterPanel.orderTypeValues}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.priceFrom}
                        label="Price, USD/h"
                    >
                        <Input
                            name="priceFrom"
                            prefix="from"
                            value={p.priceFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.priceTo}>
                        <Input
                            name="priceTo"
                            prefix="to"
                            value={p.priceTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <h3 className="order-filter-panel__header">
                        Owner status:
                    </h3>
                    <Checkbox
                        name="professional"
                        title="Professional"
                        value={p.professional}
                        onChange={this.handleChangeInput}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <Checkbox
                        name="registered"
                        title="Registered"
                        value={p.registered}
                        onChange={this.handleChangeInput}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <Checkbox
                        name="identified"
                        title="Identified"
                        value={p.identified}
                        onChange={this.handleChangeInput}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <Checkbox
                        name="anonymous"
                        title="Anonymous"
                        value={p.anonymous}
                        onChange={this.handleChangeInput}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <div className="order-filter-panel__row-gap" />
                    <FormField
                        error={p.validation.cpuCountFrom}
                        label="CPU Count"
                    >
                        <Input
                            name="cpuCountFrom"
                            prefix="from"
                            value={p.cpuCountFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.cpuCountTo}>
                        <Input
                            name="cpuCountTo"
                            prefix="to"
                            value={p.cpuCountTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        label="GPU count"
                        error={p.validation.gpuCountFrom}
                    >
                        <Input
                            name="gpuCountFrom"
                            prefix="from"
                            value={p.gpuCountFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.gpuCountTo}>
                        <Input
                            name="gpuCountTo"
                            prefix="to"
                            value={p.gpuCountTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.ramSizeFrom}
                        label="RAM size, MB"
                    >
                        <Input
                            name="ramSizeFrom"
                            prefix="from"
                            value={p.ramSizeFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.ramSizeTo}>
                        <Input
                            name="ramSizeTo"
                            prefix="to"
                            value={p.ramSizeTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.gpuRamSizeFrom}
                        label="GPU RAM size, MB"
                    >
                        <Input
                            name="gpuRamSizeFrom"
                            prefix="from"
                            value={p.gpuRamSizeFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.gpuRamSizeTo}>
                        <Input
                            name="gpuRamSizeTo"
                            prefix="to"
                            value={p.gpuRamSizeTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.ethFrom}
                        label="GPU Ethash, MH/s"
                    >
                        <Input
                            name="ethFrom"
                            prefix="from"
                            value={p.ethFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.ethTo}>
                        <Input
                            name="ethTo"
                            prefix="to"
                            value={p.ethTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.zCashFrom}
                        label="GPU Equihash, sol/s"
                    >
                        <Input
                            name="zCashFrom"
                            prefix="from"
                            value={p.zCashFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.zCashTo}>
                        <Input
                            name="zCashTo"
                            prefix="to"
                            value={p.zCashTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.redshiftFrom}
                        label="Redshift, K/Ex. time in s"
                    >
                        <Input
                            name="redshiftFrom"
                            prefix="from"
                            value={p.redshiftFrom}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.redshiftTo}>
                        <Input
                            name="redshiftTo"
                            prefix="to"
                            value={p.redshiftTo}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <Button
                        onClick={this.props.onResetFilter}
                        className="order-filter-panel__all-filters"
                        color="violet"
                    >
                        RESET FILTERS
                    </Button>
                </div>
            </div>
        );
    }
}

export default OrderFilterPanel;
export * from './types';
