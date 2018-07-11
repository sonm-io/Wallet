import { observable, computed, action } from 'mobx';
import * as moment from 'moment';
import { IFilterStore } from './filter-base';
import { RootStore } from './index';

export interface IDealFilter {
    query: string;
    dateFrom: number;
    dateTo: number;
    onlyActive: boolean;
}

export class DealFilterStore implements IDealFilter, IFilterStore {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable
    public userInput: Partial<IDealFilter> = {
        query: undefined,
        dateFrom: moment('20171201', 'YYYYMMDD').valueOf(),
        dateTo: moment()
            .endOf('day')
            .valueOf(),
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
                this.userInput[key] = values[key];
            }
        });
    }

    @computed
    public get dateFrom() {
        return this.userInput.dateFrom || 0;
    }

    @computed
    public get dateTo() {
        return this.userInput.dateTo || 0;
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
                $eq: this.rootStore.marketStore.marketAccountAddress,
            },
            date: {
                $gte: this.dateFrom,
                $lte: this.dateTo,
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
