import { observable, computed, action } from 'mobx';
import { IFilterStore } from './filter-base';

export interface IWorkerFilter {
    address: string;
}

export class WorkerFilterStore implements IWorkerFilter, IFilterStore {
    @observable
    public userInput: Partial<IWorkerFilter> = {
        address: undefined,
    };

    @action
    public updateUserInput(values: Partial<IWorkerFilter>) {
        const keys = Object.keys(values) as Array<keyof IWorkerFilter>;

        keys.forEach(key => {
            if (!(key in this.userInput)) {
                throw new Error(`Unknown user input ${key}`);
            }

            if (values[key] !== undefined) {
                this.userInput[key] = values[key];
            }
        });
    }

    @computed
    public get address() {
        return this.userInput.address || '';
    }

    @computed
    public get filter(): any {
        const result: any = {
            address: {
                $eq: this.address,
            },
        };

        return result;
    }

    @computed
    public get filterAsString(): string {
        return JSON.stringify(this.filter);
    }
}

export default WorkerFilterStore;
