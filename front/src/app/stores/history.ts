import { observable, computed, IObservableArray, toJS, autorunAsync, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'app/api';
import * as moment from 'moment';

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

export class HistoryStore {
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

    @observable public pending = false;

    @observable public txMap = new Map<string, api.ISendTransactionResult>();

    @observable protected inProgress: IObservableArray<api.ISendTransactionResult> = observable.array();

    @computed public get currentList(): api.ISendTransactionResult[] {
        const result: api.ISendTransactionResult[] = this.currentPageTxHashList.map(
            hash => toJS(this.txMap.get(hash)) as api.ISendTransactionResult,
        );

        return result;
    }

    @computed public get totalPage() {
        return this.total - (this.total % ITEMS_PER_PAGE) + ITEMS_PER_PAGE;
    }

    protected isInitiated = false;

    constructor() {
        autorunAsync(async () => {
            if (this.filterParams && this.page && this.isInitiated) { // HACK
                this.update(this.filterParams, this.page);
            }
        });
    }

    public async init() {
        this.isInitiated = true;
        await this.update(this.filterParams, this.page);
        return true;
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

    @asyncAction
    public *forceUpdate() {
        yield this.update(this.filterParams, this.page);
    }

    @asyncAction
    public *submitTransaction(params: api.ISendTransaction, password: string) {
        try {
            const created = { ...params, confirmCount: 0, status: 'created', hash: '' };
            this.inProgress.push(created);

            const result = yield Api.send(params, password);

            this.inProgress.remove(created);

            this.addTxToMap([result]);

        } catch (e) {
            this.errors.push(e);
        }
    }

    // public async init() {
    //     await this.update(this.filterParams);
    // }

    @asyncAction
    public *update(filter: api.ITxListFilter, page: number) {
        try {
            this.pending = true;

            const { data: [txList, total] } = yield Api.getSendTransactionList(
                filter,
                ITEMS_PER_PAGE,
                (page - 1) * ITEMS_PER_PAGE,
            );

            this.total = total;
            this.addTxToMap(txList);
            this.currentPageTxHashList = txList.map((x: api.ISendTransactionResult) => x.hash);
        } catch (e) {
            this.errors.push(e);
        } finally {
            this.pending = false;
        }
    }

    protected addTxToMap(txList: api.ISendTransactionResult[]) {
        txList.map((tx: api.ISendTransactionResult) => this.txMap.set(tx.hash, tx));
    }

    @action
    public setFilterFrom = (from: string) => {
        this.fromAddress = from;
    }

    @action
    public setFilterCurrency = (currency: string) => {
        this.curencyAddress = currency;
    }

    @action
    public setQuery = (query: string) => {
        this.query = query;
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
