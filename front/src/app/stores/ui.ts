import { observable, action, computed } from 'mobx';
import { IAlert, AlertType } from './types';

export class UiStore {
    protected static alertIdx = 0;
    @observable public mapIdToAlert: Map<string, IAlert> = new Map();

    protected getNextId() {
        return `${new Date()}-${UiStore.alertIdx++}`;
    }

    @action
    public processError(e: Error) {
        this.addAlert({
            type: AlertType.error,
            message: e.message,
            id: this.getNextId(),
        });
    }

    @action
    public addAlert(alert: Partial<IAlert>) {
        if (alert.message && this.mapIdToAlert.has(alert.message)) {
            this.mapIdToAlert.delete(alert.message);
        }

        const full: IAlert = {
            id: alert.id || this.getNextId(),
            message: alert.message || 'Empty message',
            type: alert.type || AlertType.error,
        };

        this.mapIdToAlert.set(full.id, full);
    }

    @action.bound
    public closeAlert(id: string) {
        this.mapIdToAlert.delete(id);
    }

    @computed
    get alertList() {
        return Array.from(this.mapIdToAlert.values());
    }
}

export default UiStore;

export * from './types';
