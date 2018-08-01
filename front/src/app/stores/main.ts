import { observable, action, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Api, IAccountInfo, IConnectionInfo } from 'app/api';
import { AlertType, ICurrencyItemView } from './types';
import { OnlineStore } from './online-store';
const { pending, catchErrors } = OnlineStore;
import { delay } from 'app/utils/async-delay';
import { trimZeros } from '../utils/trim-zeros';
import { RootStore } from './';
import { IWalletListItem } from 'app/api/types';
import {
    createBigNumber,
    TWO,
    THREE,
    ZERO,
    BN,
} from '../utils/create-big-number';
import { ILocalizator, IValidation } from 'app/localization';

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

    public static ADDRESS_ETHER = '0x';

    protected rootStore: RootStore;

    @observable.ref protected walletInfo?: IWalletListItem;
    @observable.ref public connectionInfo: IConnectionInfo;

    @computed
    public get walletName(): string {
        return this.walletInfo ? this.walletInfo.name : '';
    }

    @computed
    public get networkName(): string {
        return (this.walletInfo ? this.walletInfo.chainId : '').toLowerCase();
    }

    @computed
    public get nodeUrl(): string {
        return this.walletInfo ? this.walletInfo.nodeUrl : '';
    }

    @computed
    public get noValidationMessages(): boolean {
        return Object.keys(this.serverValidation).length === 0;
    }

    @observable.ref public serverValidation: Partial<IMainFormValues> = {};

    @observable public averageGasPrice = '';

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

    @computed
    public get etherBalance(): string {
        return MainStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.etherAddress,
        );
    }

    @computed
    public get primaryTokenBalance(): string {
        return MainStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.primaryTokenAddress,
        );
    }

    private static getTokenBalance(
        fullList: ICurrencyItemView[],
        address: string,
    ) {
        const item = fullList.find(x => x.address === address);
        const balance = item ? item.balance : '';
        return balance || '0';
    }

    public getBalanceListFor(...accounts: string[]): ICurrencyItemView[] {
        if (
            this.rootStore.myProfilesStore.accountMap === undefined ||
            this.rootStore.currencyStore.currencyMap === undefined
        ) {
            return [];
        }

        const result = Array.from(
            this.rootStore.currencyStore.currencyMap.values(),
        ).map(
            (currency): ICurrencyItemView => {
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

    @computed
    public get fullBalanceList(): ICurrencyItemView[] {
        const allAccountsAddresses = this.rootStore.myProfilesStore
            .accountAddressList;
        return this.getBalanceListFor(...allAccountsAddresses);
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *init(wallet: IWalletListItem) {
        this.walletInfo = wallet;
        yield this.autoUpdateIteration(); // wait for first update
        this.connectionInfo = (yield Api.getConnectionInfo()).data;
        this.rootStore.marketStore.updateValidators();
    }

    @action
    protected setAverageGasPrice(gasPrice: string = '') {
        this.averageGasPrice = gasPrice;
    }

    public async update() {
        const { data: gasPrice } = await Api.getGasPrice();
        this.setAverageGasPrice(gasPrice);
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

    @pending
    @asyncAction
    public *getKYCLink(
        password: string,
        address: string,
        kycAddress: string,
        fee: string,
    ) {
        const { data: link, validation } = yield Api.getKYCLink(
            password,
            address,
            kycAddress,
            fee,
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

    @pending
    @asyncAction
    protected *exportWallet() {
        const { data: text } = yield Api.exportWallet();

        return text;
    }

    public getWalletExportText = async () => {
        const text = await this.exportWallet();

        return String(text);
    };

    @action.bound
    public resetServerValidation() {
        this.serverValidation = {};
    }
}

export default MainStore;

export * from './types';

/**
 * 0xb900726a920ae31c4381b9d9ec1e0d7e990cac3c Zaschecoin
 * 0xbda864e991a5ff6f7cc12a73ecb21fcefddd4795 ZASCHECOIN10
 */
