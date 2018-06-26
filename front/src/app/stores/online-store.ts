import { observable, action, computed, when } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { delay } from 'app/utils/async-delay';
import { Api } from 'app/api'; // TODO pass to ctr
import { WalletApiError } from './types';
import { ILocalizator } from 'app/localization';

export interface IErrorProcessor {
    processError: (err: Error) => void;
}

interface IOnlineStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
}

// TODO use delegating instead inherit
export class OnlineStore {
    constructor(params: IOnlineStoreServices) {
        this.services = { ...params };
    }

    protected services: IOnlineStoreServices;

    @asyncAction
    protected *goOffline() {
        if (this.isOffline) {
            return;
        }

        this.isOffline = true;

        while (true) {
            const { data: online } = yield Api.checkConnection();

            if (online) {
                this.isOffline = false;
                break;
            } else {
                yield delay(1000);
            }
        }
    }

    protected pendingIdx = 0;
    @observable public pendingSet = new Map(); // mobx doesn't support observable set

    @action.bound
    public startPending(name: string): string {
        const pendingId = `${name}_${this.pendingIdx++}`;

        this.pendingSet.set(pendingId, true);

        return pendingId;
    }

    @action.bound
    public stopPending(pendingId: string): void {
        this.pendingSet.delete(pendingId);
    }

    @computed
    public get isPending() {
        return this.pendingSet.size > 0;
    }

    @observable public isOffline = false;

    @action
    protected handleError(e: WalletApiError, restart: boolean) {
        if (e.code === 'sonmapi_network_error') {
            // TODO err code enum
            this.goOffline();
        }

        if (e.code === 'sonmapi_network_error' && restart) {
            when(
                () => !this.isOffline,
                () => {
                    e.method.apply(e.scope, e.args);
                },
            );
        } else {
            this.services.errorProcessor.processError(e);
        }
    }

    public static pending(
        target: OnlineStore,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const method = descriptor.value;

        descriptor.value = async function() {
            const me = this as OnlineStore;

            const pendingId = me.startPending(propertyKey);

            try {
                return await method.apply(me, arguments);
            } finally {
                me.stopPending(pendingId);
            }
        };
    }

    public static catchErrors = ({ restart = false }) => (
        target: OnlineStore,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        const method = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            const store = this as OnlineStore;

            try {
                return await method.apply(store, args);
            } catch (err) {
                if (typeof err !== 'string') {
                    console.error(
                        `Unexpected exception from wallet API; Exception ${err}`,
                    );
                }

                console.error(err);
                debugger;

                store.handleError(
                    new WalletApiError(
                        err,
                        store.services.localizator.getMessageText(err),
                        store,
                        descriptor.value,
                        args,
                    ),
                    restart,
                );
            }
        };
    };

    public static getAccumulatedFlag(
        p: keyof OnlineStore,
        ...stores: OnlineStore[]
    ): boolean {
        return stores.reduce(
            (b: boolean, store: OnlineStore) => b || Boolean(store[p]),
            false,
        );
    }
}

export default OnlineStore;
