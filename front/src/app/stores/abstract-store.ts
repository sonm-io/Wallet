import { observable, action, computed, when } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { delay } from 'app/utils/async-delay';
import { Api } from 'app/api';
import { IAlert, WalletApiError, AlertType } from './types';

export class AbstractStore {
    @asyncAction
    protected * goOffline() {
        if (this.isOffline) { return; }

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

    @computed public get isPending() {
        return this.pendingSet.size > 0;
    }

    protected static alertIdx = 0;
    @observable public alerts: Map<string, IAlert> = new Map();

    @observable public isOffline = false;

    @action
    public addAlert(alert: IAlert) {
        if (this.alerts.has(alert.message)) {
            this.alerts.delete(alert.message);
        }
        this.alerts.set(`${new Date()}-${AbstractStore.alertIdx++}`, alert);
    }

    @action
    public closeAlert(id: string) {
        this.alerts.delete(id);
    }

    @action
    protected handleError(e: WalletApiError, restart: boolean) {
        console.error(e);

        if (e.code === 'network_error') { // TODO err code enum
            this.goOffline();
        }

        if (e.code === 'network_error' && restart) {
            when(() => !this.isOffline,
                () => {
                    console.log(`Restart ${e.method.name}`);

                    e.method.apply(e.scope, e.args);
                },
            );
        } else {
            this.addAlert({ message: String(e), type: AlertType.error });
        }
    }

    public static pending(target: AbstractStore, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = async function() {
            const me = this as AbstractStore;

            const pendingId = me.startPending(propertyKey);

            try {
                return await method.apply(me, arguments);
            } finally {
                me.stopPending(pendingId);
            }
        };
    }

    public static catchErrors = ({ restart = false }) => (
        target: AbstractStore,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        const method = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            const store = this as AbstractStore;

            try {
                return await method.apply(store, args);
            } catch (errorStringCode) {

                if (typeof errorStringCode !== 'string') {
                    alert(`Unexpected exception from wallet API; Exception ${errorStringCode}`);
                }

                store.handleError(
                    new WalletApiError(
                        errorStringCode,
                        `method ${propertyKey} failed`,
                        store,
                        descriptor.value,
                        args,
                    ),
                    restart,
                );
            }
        };
    }

    public static getAccumulatedFlag(p: keyof AbstractStore, ...stores: AbstractStore[]): boolean {
        return stores.reduce(
            (b: boolean, store: AbstractStore) => b || Boolean(store[p]),
            false,
        );
    }
}

export default AbstractStore;
