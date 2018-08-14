import * as React from 'react';
import { IOrderCreateParams } from 'app/stores/order-create';
import { OrderCreateView } from './view';
import { observer } from 'mobx-react';
import { withRootStore, Layout, IHasRootStore } from '../layout';

interface IOrderCreateProps extends IHasRootStore {
    onCancel: () => void;
}

export const OrderCreate = withRootStore(
    observer(
        class extends Layout<IOrderCreateProps> {
            protected get store() {
                return this.rootStore.orderCreate;
            }

            protected handleUpdateField = (
                key: keyof IOrderCreateParams,
                value: IOrderCreateParams[keyof IOrderCreateParams],
            ) => {
                this.store.updateUserInput({ [key]: value });
            };

            protected handleSubmitPassword(password: string) {
                this.store.submit(password);
            }

            public render() {
                const store = this.store;
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
        },
    ),
);
