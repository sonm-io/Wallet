import { observable, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Status } from './types';
import { OnlineStore } from './online-store';
const { pending } = OnlineStore;

export interface IListStoreApi {
    fetchList: (params: IListServerQuery) => void;
}

export interface IListServerQuery {
    limit: number;
    offset: number;
    sortBy?: string;
    filter?: string;
}

export interface IUserInput {
    page: number;
    limit: number;
    sortBy: string;
    filter: string;
}

export interface IListStore<T> {
    status: Status;
    total: number;
    offset: number;
    limit: number;
    records: T[];
    page: number;
    totalPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    updateUserInput: (input: Partial<IUserInput>) => any;
}

export function createListStore<T>(api: IListStoreApi) {
    class ListStoreClass extends OnlineStore implements IListStore<T> {
        @observable public status: Status = Status.PENDING;

        @observable public error = '';

        @observable public total = 0;

        @observable public offset = 1;

        @observable public limit = 20;

        @observable.ref public records = [];

        @observable
        private userInput: IUserInput = {
            page: 1,
            limit: 20,
            sortBy: '',
            filter: '',
        };

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

        @pending
        @asyncAction
        public *updateUserInput(input: Partial<IUserInput>) {
            const changes = Object.keys(input).filter(k => {
                const key = k as keyof IUserInput;
                const result = input[key] !== this.userInput[key];

                if (result) {
                    this.userInput[key] = input[key] as any;
                }

                return result;
            });

            if (changes.length === 0) {
                return;
            }

            const { page, limit, sortBy, filter } = this.userInput;

            const offset = (page - 1) * limit;

            this.status = Status.PENDING;

            const query: IListServerQuery = {
                offset,
                limit,
            };

            if (filter) {
                query.filter = JSON.stringify(filter);
            }

            if (sortBy) {
                query.sortBy = sortBy;
            }

            try {
                const response = yield api.fetchList(query);

                this.offset = offset;
                this.limit = limit;
                this.records = response.data.data;
                this.total = response.data.total_count;
                this.status = Status.DONE;
            } catch (e) {
                this.error = e.message;
                this.status = Status.ERROR;

                throw e;
            }
        }
    }

    return ListStoreClass;
}

export default createListStore;
