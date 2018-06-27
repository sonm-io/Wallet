import OnlineStore, { IOnlineStoreServices } from './online-store';
import { observable, action, computed } from 'mobx';
import { IKycValidator } from 'app/api';
import { RootStore } from 'app/stores';
import { asyncAction } from 'mobx-utils';
const { pending, catchErrors } = OnlineStore;

export interface IKycDataItem {
    kycLink?: string;
    validationMessage?: string;
}

export interface IKycData {
    [id: string]: IKycDataItem;
}

export interface IKycListStoreExternal {
    market: {
        marketAccountAddress: string;
        validators: IKycValidator[];
    };
    main: {
        serverValidation: {
            password?: string;
        };
    };
}

export interface IKycListInput {
    data: IKycData;
    selectedIndex?: number;
}

export class KycListStore extends OnlineStore implements IKycListInput {
    protected rootStore: RootStore;
    protected externalStores: IKycListStoreExternal;

    @observable
    protected userInput: IKycListInput = {
        data: {},
        selectedIndex: undefined,
    };

    constructor(
        rootStore: RootStore,
        externalStores: IKycListStoreExternal,
        params: IOnlineStoreServices,
    ) {
        super(params);
        this.rootStore = rootStore;
        this.externalStores = externalStores;
    }

    @asyncAction
    protected *getDataItem(password: string, validator: IKycValidator) {
        const link = yield this.rootStore.mainStore.getKYCLink(
            password,
            this.externalStores.market.marketAccountAddress,
            validator.id,
            validator.fee,
        ) as any;

        if (link) {
            return {
                kycLink: link as string,
            };
        } else {
            return {
                validationMessage: this.externalStores.main.serverValidation
                    .password,
            };
        }
    }

    @action.bound
    protected clearValidationMessage = () => {
        const data = this.data;
        Object.keys(data).forEach(function(id) {
            data[id].validationMessage = undefined;
        });
        this.userInput.data = { ...data };
    };

    @action.bound
    public select(index: number) {
        if (this.selectedIndex !== index) {
            this.clearValidationMessage();
        }
        this.userInput.selectedIndex = index;
    }

    @action.bound
    public unselect() {
        this.userInput.selectedIndex = undefined;
        this.clearValidationMessage();
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *fetchKycLink(itemIndex: number, password: string) {
        const target = this.externalStores.market.validators[itemIndex];
        const data = this.data;
        data[target.id] = yield this.getDataItem(password, target);
        this.userInput.data = { ...data };
    }

    @computed
    public get validators() {
        return this.externalStores.market.validators;
    }

    @computed
    public get data(): IKycData {
        return this.userInput.data;
    }

    @computed
    public get selectedIndex(): number | undefined {
        return this.userInput.selectedIndex;
    }
}
