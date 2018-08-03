import * as React from 'react';
import { rootStore } from 'app/stores';
import { IOrderCreateParams } from 'app/api/types';
import { OrderCreateView } from './view';
import { observer } from 'mobx-react';

const store = rootStore.orderCreateStore;

interface IOrderCreateProps {
    onCancel: () => void;
}

@observer
export class OrderCreate extends React.Component<IOrderCreateProps, never> {
    protected handleUpdateField = (
        key: keyof IOrderCreateParams,
        value: IOrderCreateParams[keyof IOrderCreateParams],
    ) => {
        store.updateUserInput({ [key]: value });
    };

    protected handleSubmitPassword(password: string) {
        store.submit(password);
    }

    public render() {
        const p = this.props;
        return (
            <OrderCreateView
                profile={store.profile}
                validation={store.validation}
                deposit={store.deposit}
                showConfirmation={store.isConfirmationState}
                validationMessage={store.validationMessage}
                onUpdateField={this.handleUpdateField}
                onCancel={p.onCancel}
                onShowConfirmation={store.showConfirmation}
                onCancelConfirmation={store.cancelConfirmation}
                onSubmitPassword={this.handleSubmitPassword}
                price={store.price}
                duration={store.duration}
                counterparty={store.counterparty}
                professional={store.professional}
                registered={store.registered}
                identified={store.identified}
                anonymous={store.anonymous}
                useBlacklist={store.useBlacklist}
                cpuCount={store.cpuCount}
                gpuCount={store.gpuCount}
                ramSize={store.ramSize}
                storageSize={store.storageSize}
                overlayAllowed={store.overlayAllowed}
                outboundAllowed={store.outboundAllowed}
                incomingAllowed={store.incomingAllowed}
                downloadSpeed={store.downloadSpeed}
                uploadSpeed={store.uploadSpeed}
                ethereumHashrate={store.ethereumHashrate}
                zcashHashrate={store.zcashHashrate}
                redshiftBenchmark={store.redshiftBenchmark}
            />
        );
    }
}
