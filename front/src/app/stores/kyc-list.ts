import OnlineStore, { IOnlineStoreServices } from './online-store';
import { observable, action, computed } from 'mobx';
import { IKycValidator } from 'app/api';
import { RootStore } from 'app/stores';
import { asyncAction } from 'mobx-utils';
const { pending, catchErrors } = OnlineStore;

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

interface IKycListState {
    kycLinks: { [kycEthAddress: string]: string };
    validationMessage?: string;
}

interface IKycListInput {
    selectedIndex?: number;
}

export class KycListStore extends OnlineStore implements IKycListInput {
    protected rootStore: RootStore;
    protected externalStores: IKycListStoreExternal;

    protected static defaultUserInput: IKycListInput = {
        selectedIndex: undefined,
    };

    protected static defaultState: IKycListState = {
        kycLinks: {},
        validationMessage: undefined,
    };

    @observable
    protected state: IKycListState = { ...KycListStore.defaultState };

    @observable
    protected userInput: IKycListInput = { ...KycListStore.defaultUserInput };

    constructor(
        rootStore: RootStore,
        externalStores: IKycListStoreExternal,
        params: IOnlineStoreServices,
    ) {
        super(params);
        this.rootStore = rootStore;
        this.externalStores = externalStores;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *fetchKycLink(itemIndex: number, password: string) {
        const links = this.links;
        const validator = this.externalStores.market.validators[itemIndex];
        const link = yield this.rootStore.mainStore.getKYCLink(
            password,
            this.externalStores.market.marketAccountAddress,
            validator.id,
            validator.fee,
        ) as any;

        if (link) {
            links[validator.id] = link;
            this.state.kycLinks = { ...links };
        } else {
            this.state.validationMessage = this.externalStores.main.serverValidation.password;
        }
    }

    @action.bound
    protected clearValidationMessage = () => {
        this.state.validationMessage = undefined;
    };

    @action.bound
    public reset() {
        this.userInput = { ...KycListStore.defaultUserInput };
        this.state = { ...KycListStore.defaultState };
    }

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

    @computed
    public get validators() {
        return this.externalStores.market.validators;
    }

    @computed
    public get links(): { [kycEthAddress: string]: string } {
        return this.state.kycLinks;
    }

    @computed
    public get validationMessage(): string | undefined {
        return this.state.validationMessage;
    }

    @computed
    public get selectedIndex(): number | undefined {
        return this.userInput.selectedIndex;
    }
}
