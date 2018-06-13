import { observable, computed, action } from 'mobx';
import { updateUserInput } from './utils/update-user-input';
import { EnumHistorySourceMode } from 'app/stores/types';
import * as moment from 'moment';
import { IFilterStore } from './filter-base';

export interface IHistoryFilter {
    query: string;
    currencyAddress: string;
    timeStart: number;
    timeEnd: number;
    fromAddress: string;
    operation: string;
}

export class HistoryFilterStore implements IHistoryFilter, IFilterStore {
    constructor(source: EnumHistorySourceMode) {
        this.source = source;
    }

    protected source: EnumHistorySourceMode;

    @observable
    public userInput: Partial<IHistoryFilter> = {
        query: undefined,
        currencyAddress: undefined,
        timeStart: undefined,
        timeEnd: undefined,
        fromAddress: undefined,
        operation: undefined,
    };

    @computed
    public get query() {
        return this.userInput.query || '';
    }

    @computed
    public get currencyAddress() {
        return this.userInput.currencyAddress || '';
    }

    @computed
    public get timeStart() {
        return (
            this.userInput.timeStart || moment('20171201', 'YYYYMMDD').valueOf()
        );
    }

    @computed
    public get timeEnd() {
        return (
            this.userInput.timeEnd ||
            moment()
                .endOf('day')
                .valueOf()
        );
    }

    @computed
    public get fromAddress() {
        return this.userInput.fromAddress || '';
    }

    @computed
    public get operation() {
        return this.userInput.operation || '';
    }

    @action.bound
    public updateUserInput(input: Partial<IHistoryFilter>) {
        updateUserInput<IHistoryFilter>(this, input);
    }

    @computed
    public get filter() {
        return {
            source: this.source,
            fromAddress: this.fromAddress,
            currencyAddress: this.currencyAddress,
            query: this.query,
            timeStart: this.timeStart,
            timeEnd: this.timeEnd,
            operation: this.operation,
        };
    }

    @computed
    public get filterAsString(): string {
        return JSON.stringify(this.filter);
    }
}
