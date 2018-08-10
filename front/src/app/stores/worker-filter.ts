import { computed } from 'mobx';
import { IFilterStore } from './list-store';
import { RootStore } from './index';

export class WorkerFilterStore implements IFilterStore {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @computed
    public get filter(): any {
        const result: any = {
            address: {
                $eq: this.rootStore.myProfilesStore.currentProfileAddress,
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
