import { observable, computed, IObservableArray, autorunAsync, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'app/api';
import * as moment from 'moment';
import { AbstractStore } from './abstract-store';
const { pending } = AbstractStore;

const Api = api.Api;
const DAY = 1000 * 60 * 60 * 24;

export interface ISendForm {
    from: string;
    to: string;
    amount: string;
    gasPrice: string;
    gasLimit: string;
    currency: string;
}

const ITEMS_PER_PAGE = 10;

export class HistoryStore extends AbstractStore {
    @observable public errors: any[] = [];

    @observable.ref public currentPageTxHashList: string[] = [];

    @observable public curencyAddress = '';
    @observable public query = '';
    @observable public toAddress = '';
    @observable public fromAddress = '';
    @observable public timeStart = moment('20171201', 'YYYYMMDD').valueOf();
    @observable public timeEnd = Date.now() + DAY;
    @observable public page = 1;
    @observable public total = 0;
    @observable public perPage = ITEMS_PER_PAGE;

    @observable public txMap = new Map<string, api.ISendTransactionResult>();

    @observable protected inProgress: IObservableArray<api.ISendTransactionResult> = observable.array();

    @observable.ref public currentList: api.ISendTransactionResult[] = [];

    @computed public get totalPage() {
        return this.total - (this.total % ITEMS_PER_PAGE) + ITEMS_PER_PAGE;
    }

    protected isInitiated = false;

    @pending
    public async init() {
        if (!this.isInitiated) {
            this.isInitiated = true;
            await this.update();
            this.createUpdateReaction();
        }
        return true;
    }

    protected createUpdateReaction() {
        autorunAsync(async () => {
            if (
                this.filterParams
                && this.page // update if any change
                && this.isInitiated
            ) {
                this.update();
            }
        });
    }

    @computed
    public get filterParams(): api.ITxListFilter {
        const filter = {
            currencyAddress: this.curencyAddress,
            toAddress: this.toAddress,
            fromAddress: this.fromAddress,
            timeStart: this.timeStart,
            timeEnd: this.timeEnd,
            query: this.query,
        };

        return filter;
    }

    @pending
    @asyncAction
    public *update() {
        const filter = this.filterParams;
        const page = this.page;

        const { data: [txList, total] } = yield Api.getSendTransactionList(
            filter,
            ITEMS_PER_PAGE,
            (page - 1) * ITEMS_PER_PAGE,
        );

        this.total = total;
        this.currentList = txList;
    }

    @action
    public setFilterFrom = (from: string) => {
        from = (from === 'all' ? '' : from);

        if (from !== this.fromAddress || this.page !== 1) {
            this.fromAddress = from;
            this.page = 1;

            return true;
        }

        return false;
    }

    @action
    public setFilterCurrency = (currency: string) => {
        currency = (currency === 'all' ? '' : currency);

        if (currency !== this.curencyAddress || this.page !== 1) {
            this.curencyAddress = currency;
            this.page = 1;

            return true;
        }

        return false;
    }

    @action
    public setQuery = (query: string) => {
        this.query = query;
        this.page = 1;
    }

    @action
    public setPage = (page: number) => {
        this.page = page;
    }

    @action
    public setFilterTime = (start: number, end: number) => {
        this.timeStart = start;
        this.timeEnd = end;
    }
}

export default HistoryStore;
