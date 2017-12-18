import { observable, action, computed, when } from 'mobx';

export class AbstractStore {
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

    @observable public errors: any[] = [];

    @observable public isOffline = false;

    @action
    protected handleError(e: Error | string, restart: boolean) {
        console.error(e);

        if (e instanceof WalletApiError && e.code === 'network_error') { // TODO err code enum
            this.isOffline = true;

            if (restart) {
                when(() => !this.isOffline,

                    () => {
                        console.log(`Connection recovered. Restart ${e.method.name}`);

                        e.method.apply(e.scope, e.args);
                    },
                );
            }
        }

        this.errors.push(e);
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

class WalletApiError extends Error {
    public method: Function;
    public code: string;
    public scope: AbstractStore;
    public args: any[];

    constructor(
        code: string,
        msg: string,
        scope: AbstractStore,
        method: Function,
        args: any[],
    ) {
        super(msg);

        this.code = code;
        this.scope = scope;
        this.args = args;
        this.method = method;
    }
}

export default AbstractStore;
