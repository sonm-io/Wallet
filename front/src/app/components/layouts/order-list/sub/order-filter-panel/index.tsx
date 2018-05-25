import * as React from 'react';
import * as cn from 'classnames';
import { Checkbox } from 'app/components/common/checkbox';
import { Input } from 'app/components/common/input';
import { Button } from 'app/components/common/button';
import { IOrderFilterPanelProps } from './types';
import { IOrderFilter, EOrderOwnerType } from 'app/stores/order-filter';
import { RadioButtonGroup } from 'app/components/common/radio-button-group';
import { ToggleButtonGroup } from 'app/components/common/toggle-button-group';
import { IChangeParams } from 'app/components/common/types';
import { ITogglerChangeParams } from 'app/components/common/toggler';
import ToggleGroup from '../../../../common/toggle-group/index';

export class OrderFilterPanel extends React.Component<
    IOrderFilterPanelProps,
    never
> {
    constructor(props: IOrderFilterPanelProps) {
        super(props);
    }

    protected handleClickType = (params: IChangeParams<string>) => {
        this.props.onUpdateFilter('type', params.value);
    };

    protected handleClickOrderOwnerType = (
        params: IChangeParams<EOrderOwnerType>,
    ) => {
        this.props.onUpdateFilter('orderOwnerType', params.value);
    };

    protected handleChangeInput = (params: IChangeParams<string>) => {
        const key = params.name as keyof IOrderFilter;
        const value: IOrderFilter[keyof IOrderFilter] = params.value;
        this.props.onUpdateFilter(key, value);
    };

    protected handleChangeCheckbox = (params: ITogglerChangeParams) => {
        this.props.onUpdateFilter(
            params.name as keyof IOrderFilter,
            params.value,
        );
    };

    protected handleClickApply = () => {
        this.props.onApply();
    };

    private static orderOwnerTypeValues = [
        EOrderOwnerType.Market,
        EOrderOwnerType.My,
    ];

    private static orderOwnerTypeTitles = ['Market orders', 'My orders'];
    private static orderTypeValues = ['Sell', 'Buy'];

    public render() {
        return (
            <div className={cn('order-filter-panel', this.props.className)}>
                <ToggleButtonGroup
                    cssClasses={ToggleGroup.fullWidthCssClasses}
                    className="order-filter-panel__order-owner"
                    name="owner"
                    value={this.props.orderOwnerType}
                    values={OrderFilterPanel.orderOwnerTypeValues}
                    titlesOrDisplayIndex={OrderFilterPanel.orderOwnerTypeTitles}
                    onChange={this.handleClickOrderOwnerType}
                />
                <div className="order-filter-panel__filters">
                    {/* Seller Address */}
                    <h3 className="order-filter-panel__header">
                        Seller address
                    </h3>
                    <Input
                        className="order-filter-panel__address"
                        name="sellerAddress"
                        value={this.props.sellerAddress}
                        onChangeDeprecated={this.handleChangeInput}
                    />

                    {/* Type */}
                    <h3 className="order-filter-panel__header">Type</h3>
                    <RadioButtonGroup
                        cssClasses={ToggleGroup.radioRowCssClasses}
                        name="orderType"
                        value={this.props.type}
                        values={OrderFilterPanel.orderTypeValues}
                        onChange={this.handleClickType}
                    />
                    <Checkbox
                        name="onlyActive"
                        title="Only active"
                        value={this.props.onlyActive}
                        onChange={this.handleChangeCheckbox}
                    />

                    {/* Price */}
                    <h3 className="order-filter-panel__header">Price, USD/h</h3>
                    <Input
                        name="priceFrom"
                        prefix="from"
                        value={this.props.priceFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                    <Input
                        name="priceTo"
                        prefix="to"
                        value={this.props.priceTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />

                    {/* Owner status */}
                    <h3 className="order-filter-panel__header">Owner status</h3>
                    <Checkbox
                        name="professional"
                        title="Professional"
                        value={this.props.professional}
                        onChange={this.handleChangeCheckbox}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <Checkbox
                        name="registered"
                        title="Registered"
                        value={this.props.registered}
                        onChange={this.handleChangeCheckbox}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <Checkbox
                        name="identified"
                        title="Identified"
                        value={this.props.identified}
                        onChange={this.handleChangeCheckbox}
                        className="order-filter-panel__owner-status-checkbox"
                    />
                    <Checkbox
                        name="anonymous"
                        title="Anonymous"
                        value={this.props.anonymous}
                        onChange={this.handleChangeCheckbox}
                        className="order-filter-panel__owner-status-checkbox"
                    />

                    {/* CPU count */}
                    <h3 className="order-filter-panel__header">CPU count</h3>
                    <Input
                        name="cpuCountFrom"
                        prefix="from"
                        value={this.props.cpuCountFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                    <Input
                        name="cpuCountTo"
                        prefix="to"
                        value={this.props.cpuCountTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />

                    {/* GPU count */}
                    <h3 className="order-filter-panel__header">GPU count</h3>
                    <Input
                        name="gpuCountFrom"
                        prefix="from"
                        value={this.props.gpuCountFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                    <Input
                        name="gpuCountTo"
                        prefix="to"
                        value={this.props.gpuCountTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />

                    {/* RAM size */}
                    <h3 className="order-filter-panel__header">RAM size, MB</h3>
                    <Input
                        name="ramSizeFrom"
                        prefix="from"
                        value={this.props.ramSizeFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                    <Input
                        name="ramSizeTo"
                        prefix="to"
                        value={this.props.ramSizeTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />

                    {/* Storage size */}
                    <h3 className="order-filter-panel__header">
                        Storage size, GB
                    </h3>
                    <Input
                        name="storageSizeFrom"
                        prefix="from"
                        value={this.props.storageSizeFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                    <Input
                        name="storageSizeTo"
                        prefix="to"
                        value={this.props.storageSizeTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />

                    {/* Footer */}
                    <Button
                        onClick={this.handleClickApply}
                        className="order-filter-panel__apply"
                    >
                        APPLY FILTERS
                    </Button>
                </div>
            </div>
        );
    }
}

export default OrderFilterPanel;
export * from './types';
