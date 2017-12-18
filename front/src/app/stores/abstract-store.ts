import { observable, action, computed } from 'mobx';

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

    @action
    protected handleError(e: Error | string) {
        console.error(e);

        if (e === 'network_error') {
            this.isOffline = false;
        }

        this.errors.push(e);
    }

    @observable public isOffline = false;

    public static pending(target: AbstractStore, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = async function() {
            const me = this as AbstractStore;

            const pendingId = me.startPending(propertyKey);

            try {
                return await method.apply(me, arguments);
            } catch (e) {
                me.handleError(e);
            } finally {
                me.stopPending(pendingId);
            }
        };
    }

    public static catchErrors(
        target: AbstractStore,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const method = descriptor.value;

        descriptor.value = async function() {
            const me = this as AbstractStore;

            try {
                return await method.apply(me, arguments);
            } catch (e) {
                me.handleError(e);
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
