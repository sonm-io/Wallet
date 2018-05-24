import * as React from 'react';
import * as cn from 'classnames';
import { Checkbox } from '../checkbox';
import { Input } from '../input';
import { Button } from '../button';
import { IOrderFilterPanelProps } from './types';
import { IOrderFilter, EOrderOwnerType } from 'app/stores/order-filter';
import { RadioButtonGroup } from '../radio-button-group';
import { ToggleButtonGroup } from '../toggle-button-group';
import { IChangeParams } from '../types';
import { ITogglerChangeParams } from '../toggler';

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

    protected handleChangeInput = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const key = event.target.name as keyof IOrderFilter;
        const value: IOrderFilter[keyof IOrderFilter] = event.target.value;
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
                {/* Market Orders */}
                <div className="order-filter-panel__span2">
                    <ToggleButtonGroup
                        className="order-filter-panel__market-my-group"
                        name="ownerType"
                        value={this.props.orderOwnerType}
                        values={OrderFilterPanel.orderOwnerTypeValues}
                        titlesOrDisplayIndex={
                            OrderFilterPanel.orderOwnerTypeTitles
                        }
                        onChange={this.handleClickOrderOwnerType}
                    />
                </div>

                {/* Seller Address */}
                <div className="order-filter-panel__header">Seller address</div>
                <div className="order-filter-panel__span2">
                    <Input
                        name="sellerAddress"
                        value={this.props.sellerAddress}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>

                {/* Type */}
                <div className="order-filter-panel__header">Type</div>
                <div className="order-filter-panel__column1">
                    <RadioButtonGroup
                        name="orderType"
                        value={this.props.type}
                        values={OrderFilterPanel.orderTypeValues}
                        onChange={this.handleClickType}
                    />
                </div>
                <div className="order-filter-panel__column2">
                    <Checkbox
                        name="onlyActive"
                        title="Only active"
                        value={this.props.onlyActive}
                        onChange={this.handleChangeCheckbox}
                    />
                </div>

                {/* Price */}
                <div className="order-filter-panel__header">Price, USD/h</div>
                <div className="order-filter-panel__column1">
                    <Input
                        name="priceFrom"
                        prefix="from"
                        value={this.props.priceFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>
                <div className="order-filter-panel__column2">
                    <Input
                        name="priceTo"
                        prefix="to"
                        value={this.props.priceTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>

                {/* Owner status */}
                <div className="order-filter-panel__header">Owner status</div>
                <div className="order-filter-panel__column1">
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
                </div>
                <div className="order-filter-panel__column2">
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
                </div>

                {/* CPU count */}
                <div className="order-filter-panel__header">CPU count</div>
                <div className="order-filter-panel__column1">
                    <Input
                        name="cpuCountFrom"
                        prefix="from"
                        value={this.props.cpuCountFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>
                <div className="order-filter-panel__column2">
                    <Input
                        name="cpuCountTo"
                        prefix="to"
                        value={this.props.cpuCountTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>

                {/* GPU count */}
                <div className="order-filter-panel__header">GPU count</div>
                <div className="order-filter-panel__column1">
                    <Input
                        name="gpuCountFrom"
                        prefix="from"
                        value={this.props.gpuCountFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>
                <div className="order-filter-panel__column2">
                    <Input
                        name="gpuCountTo"
                        prefix="to"
                        value={this.props.gpuCountTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>

                {/* RAM size */}
                <div className="order-filter-panel__header">RAM size, MB</div>
                <div className="order-filter-panel__column1">
                    <Input
                        name="ramSizeFrom"
                        prefix="from"
                        value={this.props.ramSizeFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>
                <div className="order-filter-panel__column2">
                    <Input
                        name="ramSizeTo"
                        prefix="to"
                        value={this.props.ramSizeTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>

                {/* Storage size */}
                <div className="order-filter-panel__header">
                    Storage size, GB
                </div>
                <div className="order-filter-panel__column1">
                    <Input
                        name="storageSizeFrom"
                        prefix="from"
                        value={this.props.storageSizeFrom}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>
                <div className="order-filter-panel__column2">
                    <Input
                        name="storageSizeTo"
                        prefix="to"
                        value={this.props.storageSizeTo}
                        onChangeDeprecated={this.handleChangeInput}
                    />
                </div>

                {/* Footer */}
                <div className="order-filter-panel__footer-column1">
                    {/* <a className="order-filter-panel__show-all-filters">
                        Show all filters
                    </a> */}
                </div>
                <div className="order-filter-panel__footer-column2">
                    <Button onClick={this.handleClickApply}>
                        APPLY FILTERS
                    </Button>
                </div>
            </div>
        );
    }
}

export default OrderFilterPanel;
export * from './types';
