import * as sortBy from 'lodash/fp/sortBy';
import { updateAddressMap } from './utils/update-address-map';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { observable, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { IAccountInfo, ICurrencyInfo } from 'app/api/types';
import { IAccountItemView } from 'app/stores/types';
import Api from 'app/api';
import { IValidation } from 'app/localization/types';
import { RootStore } from 'app/stores';
const { pending, catchErrors } = OnlineStore;

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
    privateKey: string;
    json: string;
}

const sortByName = sortBy(['name', 'address']);

const emptyCurrencyInfo = {
    symbol: '',
    decimalPointOffset: 2,
    name: '',
    address: '',
    balance: '',
};

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

    /**
     * selectedProfile
     * Api.getAccountList()
     * Api.getCurrencyList()
     * rootStore.mainStore.fullBalanceList, Api.getCurrencyList()
     */

    //#region Accounts

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

    // ToDo a Why?
    public transformAccountInfoToView = (
        info: IAccountInfo,
    ): IAccountItemView => {
        const isCurrencyListEmpty = this.currencyMap.size === 0;
        const primaryTokenBalance = isCurrencyListEmpty
            ? ''
            : info.currencyBalanceMap[this.primaryTokenAddress];

        const preview: IAccountItemView = {
            address: info.address,
            json: info.json,
            name: info.name,
            etherBalance: isCurrencyListEmpty
                ? ''
                : info.currencyBalanceMap[this.etherAddress],
            primaryTokenBalance,
            primaryTokenInfo: this.primaryTokenInfo,
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

    //#endregion

    //#region Currency

    @observable public currencyMap = new Map<string, ICurrencyInfo>();

    protected primaryTokenAddr: string = '';
    public get primaryTokenAddress(): string {
        return this.primaryTokenAddr;
    }

    public static ADDRESS_ETHER = '0x'; // ToDo a What for this empty address?
    public get etherAddress(): string {
        return MyProfilesStore.ADDRESS_ETHER;
    }

    @computed
    public get primaryTokenInfo(): ICurrencyInfo {
        const result = this.currencyMap.get(this.primaryTokenAddress);
        return result || emptyCurrencyInfo;
    }

    //#endregion
}
