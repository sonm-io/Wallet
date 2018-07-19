import * as React from 'react';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { IProfileBrief } from 'app/entities/profile';
import Button from 'app/components/common/button';
import { FormField } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { IOrderCreateParams, IOrderCreateValidation } from './types';
import Balance from 'app/components/common/balance-view';

export interface IOrderCreateProps extends IOrderCreateParams {
    profile: IProfileBrief;
    validation: IOrderCreateValidation;
    onUpdateField: (
        key: keyof IOrderCreateParams,
        value: IOrderCreateParams[keyof IOrderCreateParams],
    ) => void;
    deposit: string;
}

const emptyFn = () => {}; // ToDo a

export class OrderCreate extends React.Component<IOrderCreateProps, never> {
    constructor(props: IOrderCreateProps) {
        super(props);
    }

    protected handleChangeInput = (params: IChangeParams<boolean | string>) => {
        const key = params.name as keyof IOrderCreateParams;
        const value: IOrderCreateParams[keyof IOrderCreateParams] =
            params.value;
        this.props.onUpdateField(key, value);
    };

    public render() {
        const p = this.props;
        return (
            <div className="order-create">
                <ProfileBrief
                    className="order-create__profile"
                    profile={p.profile}
                />
                <div className="order-create__actions">
                    <Button
                        transparent
                        color="violet"
                        className="order-create__button"
                        onClick={emptyFn}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="violet"
                        onClick={emptyFn}
                        className="order-create__button"
                    >
                        Next
                    </Button>
                </div>
                <div className="order-create__details order-create__property-grid">
                    <h3 className="order-create__grid-header">Details</h3>
                    <FormField label="Type" />
                    <div>Buy</div>
                    <FormField
                        label="Price, SNMT/h"
                        className="order-create__label"
                    />
                    <FormField error={p.validation.price}>
                        <Input
                            name="price"
                            prefix="to"
                            value={p.price}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        label="Duration, hours"
                        className="order-create__label"
                    />
                    <FormField error={p.validation.duration}>
                        <Input
                            name="duration"
                            prefix="to"
                            value={p.duration}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField label="Order deposit">
                        <Balance
                            balance={p.deposit}
                            decimalDigitAmount={4}
                            decimalPointOffset={18}
                            round
                            symbol="SNMT"
                        />
                    </FormField>
                    <FormField
                        error={p.validation.counterparty}
                        label="Counterparty account"
                    >
                        <Input
                            name="counterparty"
                            value={p.counterparty}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                </div>
                <div className="order-create__params order-create__property-grid">
                    <h3 className="order-create__grid-header">
                        Resource parameters
                    </h3>
                    <FormField error={p.validation.cpuCount} label="CPU count">
                        <Input
                            name="cpuCount"
                            prefix="from"
                            value={p.cpuCount}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField error={p.validation.gpuCount} label="GPU count">
                        <Input
                            name="gpuCount"
                            prefix="from"
                            value={p.gpuCount}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        error={p.validation.ramSize}
                        label="Ram size, Mb"
                    >
                        <Input
                            name="ramSize"
                            prefix="from"
                            value={p.ramSize}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        error={p.validation.storageSize}
                        label="Storage sizee, Gb"
                    >
                        <Input
                            name="storageSize"
                            prefix="from"
                            value={p.storageSize}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>

                    <FormField
                        error={p.validation.downloadSpeed}
                        label="Download speed, Kb/s"
                    >
                        <Input
                            name="downloadSpeed"
                            prefix="from"
                            value={p.downloadSpeed}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        error={p.validation.uploadSpeed}
                        label="Upload speed, Kb/s"
                    >
                        <Input
                            name="uploadSpeed"
                            prefix="from"
                            value={p.uploadSpeed}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        error={p.validation.ethereumHashrate}
                        label="Ethereum mining hashrate, Mh/s*10"
                    >
                        <Input
                            name="ethereumHashrate"
                            prefix="from"
                            value={p.ethereumHashrate}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        error={p.validation.zcashHashrate}
                        label="ZCASH mining hashrate, sol/s*1000"
                    >
                        <Input
                            name="zcashHashrate"
                            prefix="from"
                            value={p.zcashHashrate}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <FormField
                        error={p.validation.redshiftBenchmark}
                        label="Redshift rendering benchmark, 1M/execution time is s"
                    >
                        <Input
                            name="redshiftBenchmark"
                            prefix="from"
                            value={p.redshiftBenchmark}
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                </div>
            </div>
        );
    }
}
