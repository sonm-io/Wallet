import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Api } from 'app/api';
import { ICurrencyInfo } from 'app/entities/currency';
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
        const etherAddressValidation = validateEtherAddress(tokenAddress).map(
            this.localizator.getMessageText,
        );
        let result: string;

        if (etherAddressValidation.length) {
            result = etherAddressValidation.join(' ;');
        } else if (this.rootStore.currencyStore.has(tokenAddress)) {
            result = this.rootStore.localizator.getMessageText(
                'token_already_exists',
            );
        } else {
            result = this.validation.tokenAddress;
        }

        return result;
    }

    @action.bound
    public setCandidateTokenAddress(tokenAddress: string) {
        if (this.candidateTokenAddress === tokenAddress) {
            return;
        }

        this.candidateTokenAddress = tokenAddress;
        this.candidateTokenInfo = undefined;
        this.validation.tokenAddress = '';

        if (this.validationCandidateToken === '') {
            this.updateCandidateTokenInfo(tokenAddress);
        }
    }

    @catchErrors({ restart: true })
    @asyncAction
    protected *updateCandidateTokenInfo(tokenAddress: string) {
        const { validation, data } = yield Api.getTokenInfo(
            tokenAddress,
            this.rootStore.myProfilesStore.accountAddressList,
        );

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

            if (tokenAddress === this.candidateTokenAddress) {
                this.candidateTokenInfo = normalizeCurrencyInfo(data);
            }
        }
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *approveCandidateToken() {
        const candidateTokenAddress = this.candidateTokenAddress;
        this.resetCandidateToken();
        yield this.rootStore.currencyStore.add(candidateTokenAddress);
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
