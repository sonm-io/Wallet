import { OnlineStore, IOnlineStoreServices } from './online-store';
import { action, observable } from 'mobx';

export class FormsStore<TUserInput, TValidation> extends OnlineStore {
    constructor(userInputDefault: TUserInput, services: IOnlineStoreServices) {
        super(services);
        this.userInput = userInputDefault;
    }

    @observable public userInput: TUserInput;

    @action.bound
    public updateUserInput(values: Partial<TUserInput>) {
        const keys = Object.keys(values) as Array<keyof TUserInput>;

        keys.forEach(key => {
            this.userInput[key] = values[key] as TUserInput[keyof TUserInput];
            this.touch(key);
        });

        this.resetServerValidation();
    }

    //#region Server Validation

    protected serverValidation: Partial<TValidation> = {};

    @action.bound
    public resetServerValidation() {
        this.serverValidation = {};
    }

    //#endregion

    //#region Touched

    @observable protected userInputTouched: Array<keyof TUserInput> = [];

    protected touch(field: keyof TUserInput) {
        if (this.userInputTouched.indexOf(field) === -1) {
            this.userInputTouched.push(field);
        }
    }

    protected isFieldTouched(field: keyof TUserInput) {
        return this.userInputTouched.indexOf(field) !== -1;
    }

    //#endregion
}
