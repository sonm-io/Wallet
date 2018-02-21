import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Api, ICurrencyInfo } from 'app/api';
import { OnlineStore } from './online-store';
const { pending, catchErrors } = OnlineStore;
import { RootStore } from './';
import { validateEtherAddress } from '../utils/validation/validate-ether-address';
import { normalizeCurrencyInfo } from './utils/normalize-currency-info';
import { ILocalizator, IHasLocalizator } from 'app/localization';

interface IFormValues {
    tokenAddress: string;
}

const emptyForm: IFormValues = {
    tokenAddress: '',
};

Object.freeze(emptyForm);

export class AddTokenStore extends OnlineStore implements IHasLocalizator {
    protected rootStore: RootStore;

    @observable public validation = { ...emptyForm };

    constructor(rootStore: RootStore, localizator: ILocalizator) {
        super({
            errorProcessor: rootStore.uiStore,
            localizator: rootStore.localizator,
        });

        this.rootStore = rootStore;
        this.localizator = localizator;
    }

    @observable public candidateTokenAddress: string = '';

    @observable public candidateTokenInfo: ICurrencyInfo | undefined;

    @computed
    get validationCandidateToken(): string {
        const tokenAddress = this.candidateTokenAddress;
        const etherAddressValidation = validateEtherAddress(tokenAddress);
        let result: string;

        if (etherAddressValidation.length) {
            result = etherAddressValidation.join(' ;');
        } else if (this.rootStore.mainStore.currencyMap.has(tokenAddress)) {
            result = this.rootStore.localizator.getMessageText(
                'token_already_exists',
            );
        } else {
            result = this.validation.tokenAddress;
        }

        return result;
    }

    @action.bound
    public setCandidateTokenAddress(address: string) {
        if (this.candidateTokenAddress === address) {
            return;
        }

        this.candidateTokenAddress = address;
        this.candidateTokenInfo = undefined;
        this.validation.tokenAddress = '';

        if (this.validationCandidateToken === '') {
            this.updateCandidateTokenInfo(address);
        }
    }

    @catchErrors({ restart: true })
    @asyncAction
    protected *updateCandidateTokenInfo(address: string) {
        const { validation, data } = yield Api.getTokenInfo(address);

        if (validation) {
            this.validation.tokenAddress = validation.address;
        } else {
            if (data === undefined) {
                throw new Error('Undefined token info');
            }

            // TODO remove
            if (!data) {
                return;
            }

            if (address === this.candidateTokenAddress) {
                this.candidateTokenInfo = data;
            }
        }
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *approveCandidateToken() {
        const candidateTokenAddress = this.candidateTokenAddress;
        this.resetCandidateToken();
        const { data: currencyInfo } = yield Api.addToken(
            candidateTokenAddress,
        );

        if (currencyInfo) {
            this.rootStore.mainStore.currencyMap.set(
                currencyInfo.address,
                normalizeCurrencyInfo(currencyInfo),
            );
        }
    }

    @action
    public resetCandidateToken() {
        this.candidateTokenAddress = '';
        this.candidateTokenInfo = undefined;
        this.validation.tokenAddress = '';
    }

    public readonly localizator: ILocalizator;
}

export default AddTokenStore;

export * from './types';
