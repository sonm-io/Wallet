import OnlineStore, { IOnlineStoreServices } from './online-store';
import { observable, action, computed } from 'mobx';
import { Api } from 'app/api';
import { RootStore } from 'app/stores';
import { asyncAction } from 'mobx-utils';
const { pending, catchErrors } = OnlineStore;

interface IKycListState {
    kycLinks: { [kycEthAddress: string]: string };
    validationMessage?: string;
}

interface IKycListInput {
    selectedIndex?: number;
}

export class KycListStore extends OnlineStore implements IKycListInput {
    protected rootStore: RootStore;

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

    constructor(rootStore: RootStore, params: IOnlineStoreServices) {
        super(params);
        this.rootStore = rootStore;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *fetchKycLink(itemIndex: number, password: string) {
        const links = this.links;
        const kycValidator = this.rootStore.validators.validators[itemIndex];

        const { data: link, validation } = yield Api.getKYCLink(
            password,
            this.rootStore.myProfiles.currentProfileAddress,
            kycValidator.id,
            kycValidator.fee,
        );

        if (link) {
            links[kycValidator.id] = link;
            this.state.kycLinks = { ...links };
        } else {
            this.state.validationMessage = validation.password;
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
        return this.rootStore.validators.validators;
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
