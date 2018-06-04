import { observable, computed, action } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { updateUserInput } from './utils/update-user-input';
import { asyncAction } from 'mobx-utils';
import { AlertType } from './types';
import { EnumTransactionStatus, IDeal } from 'app/api/types';
import { RootStore } from './';

export interface IDealDetailsInput {
    password: string;
    dealId: string;
    isBlacklisted: boolean;
}

export interface IDealDetailsStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IDealDetailsStoreApi;
}

export interface IDealDetailsStoreApi {
    close: (
        accountAddress: string,
        password: string,
        dealId: string,
        isBlacklisted: boolean,
    ) => {};
    fetchById: (id: string) => Promise<IDeal>;
}

export interface IDealDetailsStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

export class DealDetails extends OnlineStore implements IDealDetailsInput {
    protected static readonly emptyDeal: IDeal = {
        id: '0',
        supplier: {
            address: '0x1',
            status: 1,
            name: 'name 1',
        },
        consumer: {
            address: '0x2',
            status: 2,
            name: 'name 2',
        },
        masterID: '',
        askID: '',
        bidID: '',
        duration: 0,
        price: '0',
        status: 1,
        blockedBalance: '0',
        totalPayout: '0',
        startTime: 0,
        endTime: 0,
        timeLeft: 1.5,
        benchmarkMap: {
            cpuSysbenchMulti: 0,
            cpuSysbenchOne: 0,
            cpuCount: 0,
            gpuCount: 0,
            ethHashrate: 0,
            ramSize: 0,
            storageSize: 0,
            downloadNetSpeed: 0,
            uploadNetSpeed: 0,
            gpuRamSize: 0,
            zcashHashrate: 0,
            redshiftGpu: 0,
        },
    };

    protected rootStore: RootStore;
    protected externalStores: IDealDetailsStoreExternal;
    protected api: IDealDetailsStoreApi;
    protected localizator: ILocalizator;
    protected errorProcessor: IErrorProcessor;

    @observable.ref protected deal: IDeal;

    constructor(
        rootStore: RootStore,
        externalStores: IDealDetailsStoreExternal,
        params: IDealDetailsStoreServices,
    ) {
        super({
            localizator: params.localizator,
            errorProcessor: params.errorProcessor,
        });

        this.externalStores = externalStores;
        this.api = params.api;
        this.localizator = params.localizator;
        this.errorProcessor = params.errorProcessor;
        this.rootStore = rootStore;
        this.deal = DealDetails.emptyDeal;
    }

    @observable
    public userInput: IDealDetailsInput = {
        password: '',
        dealId: '',
        isBlacklisted: false,
    };

    @observable
    public serverValidation: IDealDetailsInput = {
        password: '',
        dealId: '',
        isBlacklisted: false,
    };

    @action.bound
    public updateUserInput(values: Partial<IDealDetailsInput>) {
        updateUserInput<IDealDetailsInput>(this, values);
        this.serverValidation.password = '';
    }

    @pending
    @asyncAction
    public *fetchData() {
        this.deal = yield this.api.fetchById(this.dealId);
    }

    @pending
    @asyncAction
    public *submit() {
        const password = this.password;
        const id = this.dealId;
        const isBlacklisted = this.isBlacklisted;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { data, validation } = yield this.api.close(
            accountAddress,
            password,
            id,
            isBlacklisted,
        );

        if (validation && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );
        } else {
            let alert;

            if (data.status === EnumTransactionStatus.fail) {
                alert = {
                    type: AlertType.error,
                    message: this.localizator.getMessageText([
                        'deal_finish_failed',
                        [id, data.transactionHash],
                    ]),
                };
            } else {
                alert = {
                    type: AlertType.success,
                    message: this.localizator.getMessageText([
                        'deal_finish_success',
                        [id, data.transactionHash],
                    ]),
                };
            }

            this.serverValidation.password = '';
            this.rootStore.uiStore.addAlert(alert);
        }
    }

    @computed
    public get dealId() {
        return this.userInput.dealId || '';
    }

    @computed
    public get password() {
        return this.userInput.password || '';
    }

    @computed
    public get isBlacklisted() {
        return this.userInput.isBlacklisted || false;
    }

    @computed
    public get validationPassword() {
        return this.serverValidation.password || '';
    }

    @computed
    public get dealBrief() {
        return this.deal;
    }
}

export default DealDetails;
