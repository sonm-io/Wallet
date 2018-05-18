import { observable, computed, action } from 'mobx';
import * as moment from 'moment';

export interface IDealFilter {
    address: string;
    query: string;
    dateFrom: number;
    dateTo: number;
    onlyActive: boolean;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export class DealFilterStore implements IDealFilter, IFilterStore {
    @observable
    public userInput: Partial<IDealFilter> = {
        address: undefined,
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
    public get address() {
        return this.userInput.address || '';
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
                $eq: this.address,
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
