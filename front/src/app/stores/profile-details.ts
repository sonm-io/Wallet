import { observable, action, autorun, computed } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending, catchErrors } = OnlineStore;
import { asyncAction } from 'mobx-utils';
import { RootStore } from './';
import { IKycValidator } from 'app/api/types';
import { TEthereumAddress } from '../entities/types';
import { EnumProfileStatus } from 'common/types/profile-status';
import { IProfileInfo, emptyProfile } from 'common/types/profile';

export interface IOrderDetails {
    setAddress(address: TEthereumAddress): TEthereumAddress;
    address: TEthereumAddress;
    profile: IProfileInfo;
}

export interface IProfileDetailsStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IProfileDetailsStoreApi;
}

export interface IProfileDetailsStoreApi {
    fetchByAddress: (address: string) => Promise<IProfileInfo>;
}

export interface IKycCertificate {
    serviceName: string;
    status: EnumProfileStatus;
}

export class ProfileDetails extends OnlineStore implements IOrderDetails {
    protected rootStore: RootStore;
    protected api: IProfileDetailsStoreApi;
    protected localizator: ILocalizator;
    protected errorProcessor: IErrorProcessor;

    constructor(rootStore: RootStore, services: IProfileDetailsStoreServices) {
        super({
            localizator: services.localizator,
            errorProcessor: services.errorProcessor,
        });

        this.rootStore = rootStore;

        this.api = services.api;
        this.localizator = services.localizator;
        this.errorProcessor = services.errorProcessor;

        autorun(() => {
            if (this.address !== '') {
                this.fetchData();
            }
        });
    }

    @observable
    public address: TEthereumAddress = '';

    @action
    public setAddress(address: TEthereumAddress) {
        return (this.address = address);
    }

    @observable.ref
    public profile: IProfileInfo = { ...emptyProfile };

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    protected *fetchData() {
        this.profile = yield this.api.fetchByAddress(this.address);
    }

    public static getValidatorName(
        validator: IKycValidator | undefined,
        defaultName: string,
    ) {
        return validator !== undefined && validator.name
            ? validator.name
            : defaultName;
    }

    @computed
    get certificates(): IKycCertificate[] {
        const validators = this.rootStore.validators.validators;

        return this.profile.certificates.map(x => {
            const validator = validators.find(z => z.id === x.address);

            return {
                serviceName: ProfileDetails.getValidatorName(
                    validator,
                    x.address,
                ),
                status: x.status,
            };
        });
    }
}

export default ProfileDetails;
