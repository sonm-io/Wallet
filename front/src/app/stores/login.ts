import { observable, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import Api, { IValidation } from 'app/api';

interface ILoginStoreState {
    success: boolean;
    validation?: IValidation;
}

export class LoginStore extends OnlineStore {
    constructor(services: IOnlineStoreServices) {
        super(services);
    }

    @observable
    private state: ILoginStoreState = {
        success: false,
    };

    @computed
    public get success(): boolean {
        return this.state.success;
    }

    @computed
    public get validation(): IValidation | undefined {
        return this.state.validation;
    }

    @asyncAction
    public *unlockWallet(password: string, name: string) {
        const { validation, data: success } = yield Api.unlockWallet(
            password,
            name,
        );
        this.state.success = success;
        this.state.validation = validation;
    }
}
