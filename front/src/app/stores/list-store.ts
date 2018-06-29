import { observable, computed, autorun, action, toJS } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Status } from './types';
import { IErrorProcessor, OnlineStore, IOnlineStore } from './online-store';
import { ILocalizator } from '../localization/types';

const { pending, catchErrors, debounced } = OnlineStore;

interface IFetchListResult<T> {
    records: Array<T>;
    total: number;
}

export interface IListStoreApi<TItem> {
    fetchList: (params: IListQuery) => Promise<IFetchListResult<TItem>>;
}

export interface IUserInput {
    page: number;
    limit: number;
    sortBy: string;
    filter: string;
    sortDesc: boolean;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export interface IListStore<T> extends IOnlineStore {
    status: Status;
    total: number;
    offset: number;
    limit: number;
    sortBy: string;
    sortDesc: boolean;
    records: T[];
    page: number;
    totalPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    update: () => void;
    updateUserInput: (input: Partial<IUserInput>) => void;
}

export interface IListQuery {
    limit: number;
    offset: number;
    sortBy?: string;
    sortDesc?: boolean;
    filter?: string;
}

export interface IListStoreServices<TItem> {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IListStoreApi<TItem>;
}

export interface IReactiveDependecies {
    filter: {
        filterAsString: any;
    };
}

export class ListStore<TItem> extends OnlineStore implements IListStore<TItem> {
    constructor(
        stores: IReactiveDependecies,
        services: IListStoreServices<TItem>,
        allowFetch: boolean = false,
    ) {
        super(services);

        this.services = services;
        this.reactiveDeps = stores;

        autorun(this.reactionOnFilter);
        autorun(this.reactionOnUserInput);
    }

    protected reactionOnFilter = () => {
        const filter = String(this.reactiveDeps.filter.filterAsString);

        this.updateUserInput({ filter });
    };

    protected reactionOnUserInput = () => {
        const userInput = toJS(this.userInput);
        if (userInput !== undefined) {
            this.update();
        }
    };

    protected services: IListStoreServices<TItem>;

    protected reactiveDeps: IReactiveDependecies;

    @observable public status: Status = Status.CREATED;

    @observable public error = '';

    @observable public total = 0;

    @observable public offset = 1;

    @observable public limit = 20;

    @observable.ref public records: Array<TItem> = [];

    @observable
    private userInput: IUserInput = {
        page: 1,
        limit: 20,
        sortDesc: false,
        sortBy: '',
        filter: '',
    };

    @computed
    public get sortBy() {
        return this.userInput.sortBy || '';
    }

    @computed
    public get sortDesc() {
        return this.userInput.sortDesc || false;
    }

    @computed
    public get page() {
        return Math.floor(this.offset / this.limit) + 1;
    }

    @computed
    public get totalPage() {
        return Math.floor(this.total / this.limit) + 1;
    }

    @computed
    public get hasPrevPage() {
        return this.offset > 1;
    }

    @computed
    public get hasNextPage() {
        return this.offset + this.limit < this.total;
    }

    @debounced
    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *update() {
        this.status = Status.PENDING;

        const { page, limit, sortBy, filter, sortDesc } = this.userInput;

        const offset = (page - 1) * limit;

        const query: IListQuery = {
            offset,
            limit,
            sortDesc: Boolean(sortDesc),
        };

        if (filter) {
            query.filter = filter;
        }

        if (sortBy) {
            query.sortBy = sortBy;
        }

        try {
            const response = yield this.services.api.fetchList(query);

            this.offset = offset;
            this.limit = limit;
            this.records = response.records;
            this.total = response.total;
            this.status = Status.LOADED;
        } catch (e) {
            this.error = e.message;
            this.status = Status.ERROR;

            throw e;
        }
    }

    @action
    public updateUserInput(input: Partial<IUserInput>) {
        Object.keys(input).filter(k => {
            const key = k as keyof IUserInput;
            const result = input[key] !== this.userInput[key];

            if (result) {
                this.userInput[key] = input[key] as any;
            }

            return result;
        });

        if ('filter' in input) {
            this.userInput.page = 1;
        }

        this.status = Status.UPDATED;
    }
}

export default ListStore;
