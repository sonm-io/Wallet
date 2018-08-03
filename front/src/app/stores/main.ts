import { observable, action, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Api, IConnectionInfo } from 'app/api';
import { AlertType } from './types';
import { OnlineStore } from './online-store';
const { pending, catchErrors } = OnlineStore;
import { delay } from 'app/utils/async-delay';
import { trimZeros } from '../utils/trim-zeros';
import { RootStore } from './';
import { ICurrencyInfo } from 'app/entities/currency';
import {
    createBigNumber,
    TWO,
    THREE,
    ZERO,
    BN,
} from '../utils/create-big-number';
import { ILocalizator, IValidation } from 'app/localization';
import { IAccountInfo } from 'app/entities/account';

const UPDATE_INTERVAL = 5000;

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
    privateKey: string;
    json: string;
}

const emptyForm: IMainFormValues = {
    password: '',
    passwordConfirmation: '',
    accountName: '',
    privateKey: '',
    json: '',
};

interface IMainStoreServices {
    localizator: ILocalizator;
}

Object.freeze(emptyForm);

export class MainStore extends OnlineStore {
    constructor(rootStore: RootStore, services: IMainStoreServices) {
        super({
            errorProcessor: rootStore.uiStore,
            localizator: services.localizator,
        });

        this.rootStore = rootStore;

        this.connectionInfo = {
            isTest: true,
            ethNodeURL: '',
            snmNodeURL: '',
        };

        autorun(() => {
            if (
                Array.from(rootStore.currencyStore.currencyMap.keys()).length >
                0
            ) {
                this.update();
            }
        });
    }

    protected rootStore: RootStore;

    @observable.ref public serverValidation: Partial<IMainFormValues> = {};

    @action.bound
    public resetServerValidation() {
        this.serverValidation = {};
    }

    @computed
    public get noValidationMessages(): boolean {
        return Object.keys(this.serverValidation).length === 0;
    }

    @observable.ref public connectionInfo: IConnectionInfo;

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *init() {
        yield this.autoUpdateIteration(); // wait for first update
        this.connectionInfo = (yield Api.getConnectionInfo()).data;
        this.rootStore.marketStore.updateValidators();
    }

    //#region Balance

    @computed
    public get etherBalance(): string {
        return MainStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.etherAddress,
        );
    }

    // ToDo a
    @computed
    public get primaryTokenBalance(): string {
        return MainStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.primaryTokenAddress,
        );
    }

    // ToDo a
    private static getTokenBalance(fullList: ICurrencyInfo[], address: string) {
        const item = fullList.find(x => x.address === address);
        const balance = item ? item.balance : '';
        return balance || '0';
    }

    // ToDo a
    /**
     * Returns balance amount of passed accounts for each currency.
     */
    public getBalanceListFor(...accounts: string[]): ICurrencyInfo[] {
        if (
            this.rootStore.myProfilesStore.accountMap === undefined ||
            this.rootStore.currencyStore.currencyMap === undefined
        ) {
            return [];
        }

        const result = Array.from(
            this.rootStore.currencyStore.currencyMap.values(),
        ).map(
            (currency): ICurrencyInfo => {
                let touched = false;
                const balance: BN = accounts.reduce(
                    (sum: any, accountAddr: string) => {
                        const account = this.rootStore.myProfilesStore.accountMap.get(
                            accountAddr,
                        ) as IAccountInfo;
                        const userBalance =
                            account.currencyBalanceMap[currency.address];

                        if (userBalance) {
                            touched = true;
                            sum = sum.add(createBigNumber(userBalance));
                        }

                        return sum;
                    },
                    ZERO,
                );

                return {
                    name: currency.name,
                    symbol: currency.symbol,
                    decimalPointOffset: currency.decimalPointOffset,
                    balance: touched ? balance.toString() : '',
                    address: currency.address,
                };
            },
        );

        return result;
    }

    // ToDo a
    @computed
    public get fullBalanceList(): ICurrencyInfo[] {
        const allAccountsAddresses = this.rootStore.myProfilesStore
            .accountAddressList;
        return this.getBalanceListFor(...allAccountsAddresses);
    }

    //#endregion

    //#region GasPrice

    @observable public averageGasPrice = '';

    @action
    protected setAverageGasPrice(gasPrice: string = '') {
        this.averageGasPrice = gasPrice;
    }

    public async update() {
        const { data: gasPrice } = await Api.getGasPrice();
        this.setAverageGasPrice(gasPrice);
    }

    @computed
    public get gasPriceThresholds(): [string, string] {
        let min = '5';
        let max = '15';

        if (this.averageGasPrice !== '') {
            const bn = createBigNumber(this.averageGasPrice);

            if (bn) {
                min = trimZeros(bn.div(TWO));
                max = trimZeros(bn.mul(THREE).div(TWO));
            }
        }

        return [min, max];
    }

    @catchErrors({ restart: true })
    protected async autoUpdateIteration(interval: number = UPDATE_INTERVAL) {
        try {
            if (IS_DEV) {
                window.console.time('auto-update');
            }

            await this.update();

            await delay(interval);

            setTimeout(() => this.autoUpdateIteration(), 0);
        } finally {
            if (IS_DEV) {
                window.console.timeEnd('auto-update');
            }
        }
    }

    //#endregion

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *giveMeMore(password: string, accountAddress: string) {
        const { validation } = yield Api.requestTestTokens(
            password,
            accountAddress,
        );

        if (validation) {
            this.rootStore.uiStore.addAlert({
                type: AlertType.error,
                message: `SNM delivery delayed cause: ${this.rootStore.localizator.getMessageText(
                    validation.password,
                )}`,
            });
        } else {
            this.rootStore.uiStore.addAlert({
                type: AlertType.success,
                message: this.rootStore.localizator.getMessageText(
                    'wait_your_tokens',
                ),
            });
        }
    }

    // ToDo Move to WorderList store.
    @pending
    @asyncAction
    public *confirmWorker(password: string, address: string, slaveId: string) {
        const { data: link, validation } = yield Api.worker.confirm(
            password,
            address,
            slaveId,
        );

        let result;
        if (validation) {
            this.serverValidation = {
                ...this.services.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };
        } else {
            result = link;
            this.resetServerValidation();
        }

        return result;
    }
}

export default MainStore;

export * from './types';

/**
 * 0xb900726a920ae31c4381b9d9ec1e0d7e990cac3c Zaschecoin
 * 0xbda864e991a5ff6f7cc12a73ecb21fcefddd4795 ZASCHECOIN10
 */
