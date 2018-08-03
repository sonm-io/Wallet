import * as sortBy from 'lodash/fp/sortBy';
import { updateAddressMap } from './utils/update-address-map';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { observable, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { IAccountItemView } from 'app/stores/types';
import Api from 'app/api';
import { IValidation } from 'app/localization/types';
import { RootStore } from 'app/stores';
import { IAccountInfo } from 'app/entities/account';
const { pending, catchErrors } = OnlineStore;

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
    privateKey: string;
    json: string;
}

const sortByName = sortBy(['name', 'address']);

export class MyProfilesStore extends OnlineStore {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore, services: IOnlineStoreServices) {
        super(services);
        this.rootStore = rootStore;
        autorun(() => {
            if (this.rootStore.loginStore.success) {
                this.getAccountList();
            }
        });
    }

    @observable public accountMap = new Map<string, IAccountInfo>();

    @asyncAction
    protected *getAccountList() {
        const accountList = yield Api.getAccountList();
        updateAddressMap<IAccountInfo>(accountList, this.accountMap);
    }

    @computed
    public get accountAddressList() {
        return Array.from(this.accountMap.keys());
    }

    @computed
    public get accountList(): IAccountItemView[] {
        const result = Array.from(this.accountMap.values()).map(
            this.transformAccountInfoToView,
        );

        return sortByName(result) as IAccountItemView[];
    }

    public transformAccountInfoToView = (
        info: IAccountInfo,
    ): IAccountItemView => {
        const isCurrencyListEmpty = this.rootStore.currencyStore.size === 0;
        const primaryTokenBalance = isCurrencyListEmpty
            ? ''
            : info.currencyBalanceMap[
                  this.rootStore.currencyStore.primaryTokenAddress
              ];

        const preview: IAccountItemView = {
            address: info.address,
            json: info.json,
            name: info.name,
            etherBalance: isCurrencyListEmpty
                ? ''
                : info.currencyBalanceMap[
                      this.rootStore.currencyStore.etherAddress
                  ],
            primaryTokenBalance,
            primaryTokenInfo: this.rootStore.currencyStore.primaryTokenInfo,
            usdBalance: info.marketUsdBalance,
            marketBalance: info.marketBalance,
        };

        return preview;
    };

    @catchErrors({ restart: false })
    @asyncAction
    public *deleteAccount(deleteAddress: string) {
        const { data: success } = yield Api.removeAccount(deleteAddress);

        if (success) {
            this.accountMap.delete(deleteAddress);
        }
    }

    @catchErrors({ restart: false })
    @asyncAction
    public *renameAccount(address: string, name: string) {
        const { data: success } = yield Api.renameAccount(address, name);

        if (success) {
            (this.accountMap.get(address) as IAccountInfo).name = name;
        }
    }

    // ToDo a: ServerValidation is a common feature. And we do not want to copypaste it between stores.
    @observable.ref public serverValidation: Partial<IMainFormValues> = {};

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *addAccount(
        json: string,
        password: string,
        name: string,
        privateKey?: string,
    ) {
        this.serverValidation = {};

        const { data, validation } = yield Api.addAccount(json, password, name);

        let result;

        if (validation) {
            const serverValidation = {
                ...this.services.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };

            if (privateKey) {
                serverValidation.privateKey = serverValidation.json;
                delete serverValidation.json;
            }

            this.serverValidation = serverValidation;
        } else {
            result = this.accountMap.set(data.address, data);
        }

        return result;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *createAccount(password: string, name: string, privateKey: string) {
        this.serverValidation = {};

        const { data, validation } = yield Api.createAccount(
            password,
            privateKey,
        );

        let result;

        if (validation) {
            this.serverValidation = {
                ...this.services.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };
        } else {
            result = yield this.addAccount(data, password, name, privateKey);
        }

        return result;
    }

    @pending
    @asyncAction
    public *getPrivateKey(password: string, address: string) {
        const { data: privateKey, validation } = yield Api.getPrivateKey(
            password,
            address,
        );

        if (validation) {
            return '';
        } else {
            return privateKey;
        }
    }
}
