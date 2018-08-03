import * as React from 'react';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { IProfileBrief } from 'app/entities/profile';
import Button from 'app/components/common/button';
import { FormField } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { IOrderCreateValidation } from 'app/stores/order-create';
import { IOrderCreateParams } from 'app/api/types';
import Balance from 'app/components/common/balance-view';
import { Checkbox } from 'app/components/common/checkbox';
import {
    ConfirmationPanel,
    EnumConfirmationDisplay,
} from 'app/components/common/confirmation-panel';

interface IOrderCreateProps extends IOrderCreateParams {
    profile: IProfileBrief;
    validation: IOrderCreateValidation;
    onUpdateField: (
        key: keyof IOrderCreateParams,
        value: IOrderCreateParams[keyof IOrderCreateParams],
    ) => void;
    deposit: string;
    showConfirmation: boolean;
    validationMessage?: string;
    onCancel: () => void;
    onShowConfirmation: () => void;
    onCancelConfirmation: () => void;
    onSubmitPassword: (password: string) => void;
}

export class OrderCreateView extends React.Component<IOrderCreateProps, never> {
    constructor(props: IOrderCreateProps) {
        super(props);
    }

    protected handleChangeInput = (params: IChangeParams<boolean | string>) => {
        const key = params.name as keyof IOrderCreateParams;
        const value: IOrderCreateParams[keyof IOrderCreateParams] =
            params.value;
        this.props.onUpdateField(key, value);
    };

    protected renderActions = () => {
        const p = this.props;
        return p.showConfirmation ? (
            <ConfirmationPanel
                className="order-create__actions order-create__confirmation"
                displayMode={EnumConfirmationDisplay.OneLine}
                validationMessage={p.validationMessage}
                onCancel={p.onCancelConfirmation}
                onSubmit={p.onSubmitPassword}
                labelHeader="Please, enter account password."
                labelDescription=""
                labelCancel="BACK"
                labelSubmit="CONFIRM"
            />
        ) : (
            <div className="order-create__actions">
                <Button
                    transparent
                    color="violet"
                    className="order-create__button"
                    onClick={p.onCancel}
                >
                    Cancel
                </Button>
                <Button
                    color="violet"
                    onClick={p.onShowConfirmation}
                    className="order-create__button"
                >
                    Next
                </Button>
            </div>
        );
    };

    protected renderDetails = () => {
        const p = this.props;
        return (
            <div className="order-create__details">
                <h3 className="order-create__grid-header order-create__grid-header-details">
                    Details
                </h3>
                <FormField
                    className="order-create__non-input"
                    label="Type"
                    horizontal
                >
                    Buy
                </FormField>
                <FormField
                    label="Price, SNM/h"
                    error={p.validation.price}
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__details-input"
                        name="price"
                        prefix="to"
                        value={p.price}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    label="Duration, hours"
                    error={p.validation.duration}
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__details-input"
                        name="duration"
                        prefix="to"
                        value={p.duration}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    className="order-create__non-input"
                    label="Order deposit"
                    horizontal
                >
                    <Balance
                        balance={p.deposit}
                        decimalDigitAmount={4}
                        decimalPointOffset={18}
                        round
                        symbol="SNM"
                    />
                </FormField>
                <FormField
                    label="Counterparty account"
                    error={p.validation.counterparty}
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__details-counterparty"
                        name="counterparty"
                        value={p.counterparty}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    className="order-create__non-input"
                    label="Counterparty status"
                    horizontal
                >
                    <div className="order-create__status-checkboxes">
                        <Checkbox
                            name="professional"
                            title="Professional"
                            value={p.professional}
                            onChange={this.handleChangeInput}
                        />
                        <Checkbox
                            name="identified"
                            title="Identified"
                            value={p.identified}
                            onChange={this.handleChangeInput}
                        />
                        <Checkbox
                            name="registered"
                            title="Registered"
                            value={p.registered}
                            onChange={this.handleChangeInput}
                        />
                        <Checkbox
                            name="anonymous"
                            title="Anonymous"
                            value={p.anonymous}
                            onChange={this.handleChangeInput}
                        />
                    </div>
                </FormField>
                <FormField
                    className="order-create__non-input"
                    label="Use blacklist"
                    horizontal
                >
                    <Checkbox
                        name="useBlacklist"
                        title=""
                        value={p.useBlacklist}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
            </div>
        );
    };

    protected renderParams = () => {
        const p = this.props;
        return (
            <div className="order-create__params">
                <h3 className="order-create__grid-header order-create__grid-header-params">
                    Resource parameters
                </h3>
                <FormField
                    error={p.validation.cpuCount}
                    label="CPU count"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="cpuCount"
                        prefix="from"
                        value={p.cpuCount}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.gpuCount}
                    label="GPU count"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="gpuCount"
                        prefix="from"
                        value={p.gpuCount}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.ramSize}
                    label="Ram size, Mb"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="ramSize"
                        prefix="from"
                        value={p.ramSize}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.storageSize}
                    label="Storage size, Gb"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="storageSize"
                        prefix="from"
                        value={p.storageSize}
                        onChange={this.handleChangeInput}
                    />
                </FormField>

                <FormField
                    className="order-create__non-input"
                    label="Overlay is allowed"
                    horizontal
                >
                    <Checkbox
                        name="overlayAllowed"
                        title=""
                        value={p.overlayAllowed}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    className="order-create__non-input"
                    label="Outbound connection is allowed"
                    horizontal
                >
                    <Checkbox
                        name="outboundAllowed"
                        title=""
                        value={p.outboundAllowed}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    className="order-create__non-input"
                    label="Incoming connection is allowed"
                    horizontal
                >
                    <Checkbox
                        name="incomingAllowed"
                        title=""
                        value={p.incomingAllowed}
                        onChange={this.handleChangeInput}
                    />
                </FormField>

                <FormField
                    error={p.validation.downloadSpeed}
                    label="Download speed, Kb/s"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="downloadSpeed"
                        prefix="from"
                        value={p.downloadSpeed}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.uploadSpeed}
                    label="Upload speed, Kb/s"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="uploadSpeed"
                        prefix="from"
                        value={p.uploadSpeed}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.ethereumHashrate}
                    label="Ethereum mining hashrate, Mh/s*10"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="ethereumHashrate"
                        prefix="from"
                        value={p.ethereumHashrate}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.zcashHashrate}
                    label="ZCASH mining hashrate, sol/s*1000"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="zcashHashrate"
                        prefix="from"
                        value={p.zcashHashrate}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
                <FormField
                    error={p.validation.redshiftBenchmark}
                    label="Redshift rendering benchmark, 1M/execution time is s"
                    horizontal
                >
                    <Input
                        className="order-create__input order-create__params-input"
                        name="redshiftBenchmark"
                        prefix="from"
                        value={p.redshiftBenchmark}
                        onChange={this.handleChangeInput}
                    />
                </FormField>
            </div>
        );
    };

    public render() {
        const p = this.props;
        return (
            <div className="order-create">
                <ProfileBrief
                    className="order-create__profile"
                    profile={p.profile}
                />
                {this.renderActions()}
                {this.renderDetails()}
                {this.renderParams()}
            </div>
        );
    }
}
