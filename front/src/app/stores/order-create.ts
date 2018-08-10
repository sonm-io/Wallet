import { observable, computed, action } from 'mobx';
import { updateUserInput } from './utils/update-user-input';
import validatePositiveNumber from '../utils/validation/validate-positive-number';
import { validatePositiveInteger } from '../utils/validation/validate-positive-integer';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { IProfileBrief } from 'app/entities/profile';
import { TypeNotStrictEthereumAddress } from '../api/runtime-types';
import { asyncAction } from 'mobx-utils';
import { RootStore } from 'app/stores';
import ProfileApi from 'app/api/sub/profile-api';
const { pending, catchErrors } = OnlineStore;

interface IDealDetails {
    price: string;
    duration: string;
    counterparty: string;
    professional: boolean;
    registered: boolean;
    identified: boolean;
    anonymous: boolean;
    useBlacklist: boolean;
}

interface IResourceParams {
    cpuCount: string;
    gpuCount: string;
    ramSize: string;
    storageSize: string;
    overlayAllowed: boolean;
    outboundAllowed: boolean;
    incomingAllowed: boolean;
    downloadSpeed: string;
    uploadSpeed: string;
    ethereumHashrate: string;
    zcashHashrate: string;
    redshiftBenchmark: string;
}

export type IOrderCreateParams = IDealDetails & IResourceParams;

export type IOrderCreateValidation = Partial<
    { [P in keyof IOrderCreateParams]: string }
>;

interface IOrderCreateStoreServices extends IOnlineStoreServices {
    profileApi: ProfileApi;
}

const defaultParams: IOrderCreateParams = {
    price: '',
    duration: '',
    counterparty: '',
    professional: false,
    registered: false,
    identified: false,
    anonymous: false,
    useBlacklist: false,
    cpuCount: '',
    gpuCount: '',
    ramSize: '',
    storageSize: '',
    overlayAllowed: false,
    outboundAllowed: false,
    incomingAllowed: false,
    downloadSpeed: '',
    uploadSpeed: '',
    ethereumHashrate: '',
    zcashHashrate: '',
    redshiftBenchmark: '',
};

const VALIDATION_MSG = 'incorrect';

const integerParams: Array<keyof IOrderCreateParams> = ['cpuCount', 'gpuCount'];

const floatParams: Array<keyof IOrderCreateParams> = [
    'price',
    'duration',
    'ramSize',
    'storageSize',
    'downloadSpeed',
    'uploadSpeed',
    'ethereumHashrate',
    'zcashHashrate',
    'redshiftBenchmark',
];

export class OrderCreateStore extends OnlineStore
    implements IOrderCreateParams {
    //#region Private Static
    protected static validateFloat = (value: string) => {
        if (value === '0' || value === '') {
            return '';
        }
        return validatePositiveNumber(value).join(', ');
    };

    protected static validateInteger = (value: string) => {
        if (value === '0' || value === '') {
            return '';
        }
        return validatePositiveInteger(value).join(', ');
    };
    //#endregion

    protected rootStore: RootStore;
    protected profileApi: ProfileApi;

    constructor(rootStore: RootStore, services: IOrderCreateStoreServices) {
        super(services);
        this.rootStore = rootStore;
        this.profileApi = services.profileApi;
    }

    @observable public userInput: IOrderCreateParams = defaultParams;

    @action.bound
    public updateUserInput(values: Partial<IOrderCreateParams>) {
        updateUserInput<IOrderCreateParams>(this, values);
    }

    @action.bound
    public showConfirmation() {
        this.isConfirmationState = true;
    }

    @action.bound
    public cancelConfirmation() {
        this.isConfirmationState = false;
        this.validationMessage = undefined;
    }

    private mockApiCall = async (password: string): Promise<string> => {
        return new Promise<string>(function(resolve, reject) {
            setTimeout(resolve, 2000, password);
        });
    };

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *submit(password: string) {
        const result = yield this.mockApiCall(password); // ToDo replace with real API call
        this.isConfirmationState = false;
        this.validationMessage = undefined;
        return result;
    }

    //#region Fields Validation
    protected validate = (
        params: Array<keyof IOrderCreateParams>,
        method: (value: string) => string,
    ): IOrderCreateValidation => {
        const initialAcc: IOrderCreateValidation = {};
        return params.reduce((acc, key) => {
            acc[key] = method(String(this.userInput[key])) && VALIDATION_MSG;
            return acc;
        }, initialAcc);
    };

    @computed
    public get validateCounterparty(): string {
        let result = '';

        if (this.userInput.counterparty !== '') {
            try {
                TypeNotStrictEthereumAddress(this.userInput.counterparty);
            } catch (e) {
                result = 'incorrect ethereum address'; // TODO use localizator
            }
        }

        return result;
    }

    @computed
    get validation(): IOrderCreateValidation {
        return {
            counterparty: this.validateCounterparty,
            ...this.validate(integerParams, OrderCreateStore.validateInteger),
            ...this.validate(floatParams, OrderCreateStore.validateFloat),
        };
    }
    //#endregion

    @computed
    public get profile(): IProfileBrief {
        const account = this.rootStore.marketStore.marketAccountView;
        const status = this.rootStore.myProfilesStore.currentProfile.status;
        return account !== undefined
            ? {
                  address: account.address,
                  name: account.name,
                  status,
              }
            : {
                  address: '0',
                  status,
              };
    }

    @observable public validationMessage?: string = undefined;

    @observable public isConfirmationState: boolean = false;

    @computed
    public get deposit(): string {
        const account = this.rootStore.marketStore.marketAccountView;
        return account !== undefined ? account.primaryTokenBalance : ''; // ToDo a
    }

    //#region UserInput
    @computed
    public get price() {
        return this.userInput.price;
    }

    @computed
    public get duration() {
        return this.userInput.duration;
    }

    @computed
    public get counterparty() {
        return this.userInput.counterparty;
    }

    @computed
    public get professional() {
        return this.userInput.professional;
    }

    @computed
    public get registered() {
        return this.userInput.registered;
    }

    @computed
    public get identified() {
        return this.userInput.identified;
    }

    @computed
    public get anonymous() {
        return this.userInput.anonymous;
    }

    @computed
    public get useBlacklist() {
        return this.userInput.useBlacklist;
    }

    @computed
    public get cpuCount() {
        return this.userInput.cpuCount;
    }

    @computed
    public get gpuCount() {
        return this.userInput.gpuCount;
    }

    @computed
    public get ramSize() {
        return this.userInput.ramSize;
    }

    @computed
    public get storageSize() {
        return this.userInput.storageSize;
    }

    @computed
    public get overlayAllowed() {
        return this.userInput.overlayAllowed;
    }

    @computed
    public get outboundAllowed() {
        return this.userInput.outboundAllowed;
    }

    @computed
    public get incomingAllowed() {
        return this.userInput.incomingAllowed;
    }

    @computed
    public get downloadSpeed() {
        return this.userInput.downloadSpeed;
    }

    @computed
    public get uploadSpeed() {
        return this.userInput.uploadSpeed;
    }

    @computed
    public get ethereumHashrate() {
        return this.userInput.ethereumHashrate;
    }

    @computed
    public get zcashHashrate() {
        return this.userInput.zcashHashrate;
    }

    @computed
    public get redshiftBenchmark() {
        return this.userInput.redshiftBenchmark;
    }
    //#endregion
}
