import {
    observable,
    computed,
    IObservableArray,
    autorunAsync,
    action,
} from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'app/api';
import * as moment from 'moment';
import { OnlineStore } from './online-store';
import { RootStore } from './';
import { IHasLocalizator, ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { THistorySourceMode } from './types';

const Api = api.Api;

export interface ISendForm {
    from: string;
    to: string;
    amount: string;
    gasPrice: string;
    gasLimit: string;
    currency: string;
}

const ITEMS_PER_PAGE = 4;

export class HistoryStore extends OnlineStore implements IHasLocalizator {
    @observable public errors: any[] = [];

    @observable.ref public currentPageTxHashList: string[] = [];

    @observable public operation = '';
    @observable public curencyAddress = '';
    @observable public query = '';
    @observable public toAddress = '';
    @observable public fromAddress = '';
    @observable public timeStart = moment('20171201', 'YYYYMMDD').valueOf();
    @observable
    public timeEnd = moment()
        .endOf('day')
        .valueOf();
    @observable public page = 1;
    @observable public total = 0;
    @observable public perPage = ITEMS_PER_PAGE;

    @observable public txMap = new Map<string, api.ISendTransactionResult>();

    @observable
    protected inProgress: IObservableArray<
        api.ISendTransactionResult
    > = observable.array();

    @observable.ref public currentList: api.ISendTransactionResult[] = [];

    @computed
    public get totalPage() {
        return this.total - this.total % ITEMS_PER_PAGE + ITEMS_PER_PAGE;
    }

    protected isInitiated = false;

    protected rootStore: RootStore;
    protected source: THistorySourceMode;

    public constructor(
        rootStore: RootStore,
        localizator: ILocalizator,
        source: THistorySourceMode,
    ) {
        super({
            errorProcessor: rootStore.uiStore,
            localizator,
        });
        this.rootStore = rootStore;
        this.localizator = localizator;
        this.source = source;
    }

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
                this.filterParams &&
                this.page && // update if any change
                this.isInitiated
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
            operation: this.operation,
        };

        return filter;
    }

    @pending
    @asyncAction
    public *update() {
        const filter = this.filterParams;
        const page = this.page;
        const source = this.source;

        const { data: [txList, total] } = yield Api.getSendTransactionList(
            source,
            filter,
            ITEMS_PER_PAGE,
            (page - 1) * ITEMS_PER_PAGE,
        );

        this.total = total;
        this.currentList = txList;
    }

    @action
    public setFilterFrom = (from: string) => {
        from = from === 'all' ? '' : from;

        if (from !== this.fromAddress || this.page !== 1) {
            this.fromAddress = from;
            this.page = 1;

            return true;
        }

        return false;
    };

    @action
    public setFilterCurrency = (currency: string) => {
        currency = currency === 'all' ? '' : currency;

        if (currency !== this.curencyAddress || this.page !== 1) {
            this.curencyAddress = currency;
            this.page = 1;

            return true;
        }

        return false;
    };

    @action
    public setFilterOperation = (operation: string) => {
        if (operation !== this.operation || this.page !== 1) {
            this.operation = operation;
            this.page = 1;

            return true;
        }

        return false;
    };

    @action
    public setQuery = (query: string) => {
        this.query = query;
        this.page = 1;
    };

    @action
    public setPage = (page: number) => {
        this.page = page;
    };

    @action
    public setFilterTime = (start: number, end: number) => {
        this.timeStart = start;
        this.timeEnd = end;
    };

    public readonly localizator: ILocalizator;
}

export default HistoryStore;
