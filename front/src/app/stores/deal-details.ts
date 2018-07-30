import { observable, computed, action } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { asyncAction } from 'mobx-utils';
import { AlertType } from './types';
import { EnumTransactionStatus, IDeal } from 'app/api/types';
import { RootStore } from './';
import validatePositiveNumber from '../utils/validation/validate-positive-number';

export interface IDealDetailsInput {
    password: string;
    isBlacklisted: boolean;
    newPrice: string;
    newDuration: string;
    changeRequestId: string;
    action: string;
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
    createChangeRequest: (
        accountAddress: string,
        password: string,
        dealId: string,
        newPrice: string,
        newDuration: string,
    ) => {};
    cancelChangeRequest: (
        accountAddress: string,
        password: string,
        dealId: string,
    ) => {};
    fetchById: (id: string) => Promise<IDeal>;
}

export interface IDealDetailsStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

const emptyForm: IDealDetailsInput = {
    password: '',
    isBlacklisted: false,
    newPrice: '',
    newDuration: '',
    changeRequestId: '',
    action: '',
};
Object.freeze(emptyForm);

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
            networkOverlay: false,
            networkOutbound: false,
            networkIncoming: false,
        },
    };

    protected rootStore: RootStore;
    protected externalStores: IDealDetailsStoreExternal;
    protected api: IDealDetailsStoreApi;
    protected localizator: ILocalizator;
    protected errorProcessor: IErrorProcessor;

    public static readonly AUTO_UPDATE_DELAY = 2500;

    @observable.ref public deal: IDeal;
    @observable public dealId: string = '';

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

    @observable protected userInputTouched: Array<keyof IDealDetailsInput> = [];

    @observable public userInput: IDealDetailsInput = { ...emptyForm };

    protected isFieldTouched(fieldName: keyof IDealDetailsInput) {
        return this.userInputTouched.indexOf(fieldName) !== -1;
    }

    @observable
    protected serverValidation: IDealDetailsInput = { ...emptyForm };

    @action.bound
    public updateUserInput(values: Partial<IDealDetailsInput>) {
        const keys = Object.keys(values) as Array<keyof IDealDetailsInput>;

        keys.forEach(key => {
            if (values[key] !== undefined) {
                this.userInput[key] = String(values[key]);

                if (this.userInputTouched.indexOf(key) === -1) {
                    this.userInputTouched.push(key);
                }
            }
        });

        this.resetServerValidation();
    }

    @action.bound
    public resetServerValidation() {
        this.serverValidation = { ...emptyForm };
    }

    @action.bound
    public resetUserInput() {
        this.resetServerValidation();
        this.userInputTouched = [];
        this.userInput = {
            ...emptyForm,
        };
    }

    @pending
    @asyncAction
    public *setDealId(dealId: string) {
        if (this.dealId !== dealId) {
            this.dealId = dealId;
            this.deal = yield this.api.fetchById(dealId);
        }
    }

    @pending
    @asyncAction
    public *update() {
        const deal = yield this.api.fetchById(this.dealId);

        if (this.checkPending('changeRequest')) {
            if (
                deal.price !== this.deal.price ||
                deal.duration !== this.deal.duration ||
                (deal.changeRequests.length && !this.deal.changeRequests) ||
                (this.deal.changeRequests &&
                    JSON.stringify(deal.changeRequests) !==
                        JSON.stringify(this.deal.changeRequests))
            ) {
                this.stopPending('changeRequest');
            }
        }

        this.deal = deal;
    }

    @computed
    public get isPending() {
        return (
            this.checkPending('changeRequest') ||
            this.checkPending('finishDeal')
        );
    }

    private addAlert(
        id: string,
        data: any,
        successMessage: string,
        failMessage: string,
    ) {
        let alert;

        if (data.status === EnumTransactionStatus.fail) {
            alert = {
                type: AlertType.error,
                message: this.localizator.getMessageText([
                    failMessage,
                    [id, data.transactionHash],
                ]),
            };
        } else {
            alert = {
                type: AlertType.success,
                message: this.localizator.getMessageText([
                    successMessage,
                    [id, data.transactionHash],
                ]),
            };
        }

        this.serverValidation.password = '';
        this.rootStore.uiStore.addAlert(alert);
    }

    @pending
    @asyncAction
    public *finish() {
        this.startPending('finishDeal', false);

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
            this.addAlert(
                id,
                data,
                'deal_finish_success',
                'deal_finish_failed',
            );
        }

        this.stopPending('finishDeal');
    }

    @pending
    @asyncAction
    public *cancelChangeRequest() {
        this.startPending('changeRequest', false);

        const password = this.password;
        const id = this.changeRequestId;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { validation } = yield this.api.cancelChangeRequest(
            accountAddress,
            password,
            id,
        );

        if (validation && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );

            this.stopPending('changeRequest');
        }
    }

    @pending
    @asyncAction
    public *actionChangeRequest() {
        this.startPending('changeRequest', false);

        const newPrice = this.newPrice;
        const newDuration = this.newDuration;
        const password = this.password;
        const id = this.dealId;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { validation } = yield this.api.createChangeRequest(
            accountAddress,
            password,
            id,
            newPrice,
            newDuration,
        );

        if (validation && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );

            this.stopPending('changeRequest');
        }
    }

    @computed
    public get password() {
        return this.userInput.password;
    }

    @computed
    public get newPrice() {
        return this.userInput.newPrice;
    }

    @computed
    public get newDuration() {
        return this.userInput.newDuration;
    }

    @computed
    public get isBlacklisted() {
        return this.userInput.isBlacklisted;
    }

    @computed
    public get changeRequestId() {
        return this.userInput.changeRequestId;
    }

    @computed
    public get action() {
        return this.userInput.action;
    }

    private validatePrice = (value: string) => {
        if (this.isFieldTouched('newPrice')) {
            if (parseFloat(value) < 0.0001) {
                return 'price_to_small';
            }
            return validatePositiveNumber(value).join(', ');
        } else {
            return '';
        }
    };

    @computed
    public get validation() {
        return {
            price: this.services.localizator.getMessageText(
                this.validatePrice(String(this.userInput.newPrice)),
            ),
            password: this.serverValidation.password || '',
        };
    }

    protected updateTick = async () => {
        if (!this.isAutoUpdateEnabled) {
            return;
        }

        await this.update();

        await new Promise(done =>
            setTimeout(done, DealDetails.AUTO_UPDATE_DELAY),
        );

        if (this.isAutoUpdateEnabled) {
            this.updateTick();
        }
    };

    protected isAutoUpdateEnabled = false;

    public startAutoUpdate = () => {
        if (this.isAutoUpdateEnabled === false) {
            this.isAutoUpdateEnabled = true;
            this.updateTick();
        }
    };

    public stopAutoUpdate = () => {
        this.isAutoUpdateEnabled = false;
    };
}

export default DealDetails;
