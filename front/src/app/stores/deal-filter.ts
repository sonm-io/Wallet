import { observable, computed, action } from 'mobx';
import * as moment from 'moment';
import { IFilterStore } from './filter-base';
import { RootStore } from './index';

export interface IDealFilter {
    query: string;
    dateRange: [Date, Date];
    onlyActive: boolean;
}

export class DealFilterStore implements IDealFilter, IFilterStore {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    public static defaultDateRange: [Date, Date] = [
        moment('20171201', 'YYYYMMDD').toDate(),
        moment()
            .endOf('day')
            .toDate(),
    ];

    @observable
    public userInput: IDealFilter = {
        query: '',
        dateRange: DealFilterStore.defaultDateRange,
        onlyActive: true,
    };

    @action
    public updateUserInput(values: Partial<IDealFilter>) {
        const keys = Object.keys(values) as Array<keyof IDealFilter>;

        keys.forEach(key => {
            if (!(key in this.userInput)) {
                throw new Error(`Unknown user input ${key}`);
            }

            if (values[key] !== undefined) {
                this.userInput[key] = values[key] as any;
            }
        });
    }

    @computed
    public get dateRange(): [Date, Date] {
        return this.userInput.dateRange;
    }

    @computed
    public get query() {
        return this.userInput.query || '';
    }

    @computed
    public get onlyActive() {
        return this.userInput.onlyActive || false;
    }

    @computed
    public get filter(): any {
        const result: any = {
            address: {
                $eq: this.rootStore.myProfilesStore.currentProfileAddress,
            },
            date: {
                $gte: this.dateRange[0].valueOf(),
                $lte: this.dateRange[1].valueOf(),
            },
            onlyActive: {
                $eq: this.onlyActive,
            },
            query: {
                $like: this.query,
            },
        };

        return result;
    }

    @computed
    public get filterAsString(): string {
        return JSON.stringify(this.filter);
    }
}

export default DealFilterStore;
