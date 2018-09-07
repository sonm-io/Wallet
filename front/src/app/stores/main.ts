import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Api } from 'app/api';
import { AlertType } from './types';
import { OnlineStore, IOnlineStoreServices } from './online-store';
const { pending, catchErrors } = OnlineStore;
import { RootStore } from './';
import { IValidation } from 'app/localization';

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

Object.freeze(emptyForm);

export class MainStore extends OnlineStore {
    constructor(rootStore: RootStore, services: IOnlineStoreServices) {
        super(services);
        this.rootStore = rootStore;
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

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *giveMeMore(password: string, accountAddress: string) {
        const { validation } = yield Api.requestTestTokens(
            password,
            accountAddress,
        );

        if (validation) {
            this.rootStore.ui.addAlert({
                type: AlertType.error,
                message: `SNM delivery delayed cause: ${this.rootStore.localizator.getMessageText(
                    validation.password,
                )}`,
            });
        } else {
            this.rootStore.ui.addAlert({
                type: AlertType.success,
                message: this.rootStore.localizator.getMessageText(
                    'wait_your_tokens',
                ),
            });
        }
    }

    // ToDo a Move to WorkerList store after create FormStore.
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
