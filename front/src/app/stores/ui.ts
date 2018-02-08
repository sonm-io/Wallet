import { observable, action } from 'mobx';
import { IAlert, AlertType } from './types';

export class UiStore {
    protected static alertIdx = 0;
    @observable public alerts: Map<string, IAlert> = new Map();

    @action
    public processError(e: Error) {
        this.addAlert({ type: AlertType.error, message: e.message });
    }

    @action
    public addAlert(alert: IAlert) {
        if (this.alerts.has(alert.message)) {
            this.alerts.delete(alert.message);
        }
        this.alerts.set(`${new Date()}-${UiStore.alertIdx++}`, alert);
    }

    @action
    public closeAlert(id: string) {
        this.alerts.delete(id);
    }
}

export default UiStore;

export * from './types';
