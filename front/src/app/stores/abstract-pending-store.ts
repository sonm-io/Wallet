import { observable, action, computed } from 'mobx';

export class AbstractPendingStore {
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
    protected handleError(e: Error) {
        console.error(e);

        this.errors.push(e.message || e);
    }

    public static pending(target: AbstractPendingStore, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = async function() {
            const me = this as AbstractPendingStore;

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
        target: AbstractPendingStore,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const method = descriptor.value;

        descriptor.value = async function() {
            const me = this as AbstractPendingStore;

            try {
                return await method.apply(me, arguments);
            } catch (e) {
                me.handleError(e);
            }
        };
    }
}

export default AbstractPendingStore;
