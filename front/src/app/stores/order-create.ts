import { observable, computed, action, autorun } from 'mobx';
import { updateUserInput } from './utils/update-user-input';
import validatePositiveNumber from '../utils/validation/validate-positive-number';
import { validatePositiveInteger } from '../utils/validation/validate-positive-integer';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { IProfileBrief } from 'app/entities/profile';
import { IProfileFull, IOrderCreateParams } from 'app/api/types';
import { TypeNotStrictEthereumAddress } from '../api/runtime-types';
import { asyncAction } from 'mobx-utils';
import { RootStore } from 'app/stores';
import ProfileApi from 'app/api/sub/profile-api';
import OrderApi from 'app/api/sub/order-api';
import { ProfileDetails } from 'app/stores/profile-details';
const { pending, catchErrors } = OnlineStore;

export type IOrderCreateValidation = Partial<
    { [P in keyof IOrderCreateParams]: string }
>;

export interface ICreateOrderStoreApi {
    create: (
        password: string,
        address: string,
        order: IOrderCreateParams,
    ) => {};
}

interface IOrderCreateStoreServices extends IOnlineStoreServices {
    profileApi: ProfileApi;
    orderApi: OrderApi;
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
    protected orderApi: OrderApi;

    constructor(rootStore: RootStore, services: IOrderCreateStoreServices) {
        super(services);

        this.rootStore = rootStore;
        this.profileApi = services.profileApi;
        this.orderApi = services.orderApi;

        autorun(() => {
            if (this.rootStore.marketStore.marketAccountAddress !== '') {
                this.fetchProfileDetails();
            }
        });
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

    @observable
    protected profileDetails: IProfileFull = ProfileDetails.emptyProfile;

    private mockApiCall = async (): Promise<void> => {
        return new Promise<void>(function(resolve, reject) {
            setTimeout(resolve, 2000);
        });
    };

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *requestOptimusPrice() {
        yield this.mockApiCall();
        this.updateUserInput({ price: '12.1234' });
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *submit(password: string) {
        console.log(this.userInput);

        const { validation } = yield this.orderApi.create(
            password,
            this.rootStore.marketStore.marketAccountAddress,
            this.userInput,
        );

        if (validation.password !== '') {
            this.validationMessage = this.services.localizator.getMessageText(
                validation.password,
            );
        } else {
            this.isConfirmationState = false;
        }
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

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *fetchProfileDetails() {
        this.profileDetails = yield this.profileApi.fetchByAddress(
            this.rootStore.marketStore.marketAccountAddress,
        );
    }

    @computed
    public get profile(): IProfileBrief {
        const account = this.rootStore.marketStore.marketAccountView;

        return account !== undefined
            ? {
                  address: account.address,
                  name: account.name,
                  status: this.profileDetails.status,
              }
            : {
                  address: '0',
                  status: this.profileDetails.status,
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
