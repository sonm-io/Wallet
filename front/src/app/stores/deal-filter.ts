import { observable, computed, action } from 'mobx';
import * as moment from 'moment';
import { IFilterStore } from './filter-base';

export interface IDealFilter {
    address: string;
    query: string;
    dateRange: [Date, Date];
    onlyActive: boolean;
}

export interface IDealFilterStoreExternals {
    market: {
        marketAccountAddress: string;
    };
}

export class DealFilterStore implements IDealFilter, IFilterStore {
    private config: IDealFilterStoreExternals;

    constructor(config: IDealFilterStoreExternals) {
        this.config = config;
        // autorun(() => {
        //     const fromAddress = config.market.marketAccountAddress;
        //     this.updateUserInput({ address: fromAddress });
        // });
    }

    protected static readonly defaultDateRange: [Date, Date] = [
        moment('20171201', 'YYYYMMDD').toDate(),
        moment()
            .endOf('day')
            .toDate(),
    ];

    @observable
    public userInput: Partial<IDealFilter> = {
        address: undefined,
        query: undefined,
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
                this.userInput[key] = values[key];
            }
        });
    }

    @computed
    public get address() {
        console.log('address');
        return this.config.market.marketAccountAddress; // this.userInput.address || '';
    }

    @computed
    public get dateRange() {
        return this.userInput.dateRange || DealFilterStore.defaultDateRange;
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
        console.log('filter');
        const result: any = {
            address: {
                $eq: this.address,
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
        console.log(JSON.stringify(this.filter));
        return JSON.stringify(this.filter);
    }
}

export default DealFilterStore;
