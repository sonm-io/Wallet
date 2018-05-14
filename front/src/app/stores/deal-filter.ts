import { observable, computed, action } from 'mobx';

export interface IDealFilter {
    address: string;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export class DealFilterStore implements IDealFilter, IFilterStore {
    @observable
    public userInput: Partial<IDealFilter> = {
        address: undefined,
    };

    @action
    public updateUserInput(values: Partial<IDealFilter>) {
        const keys = Object.keys(values) as Array<keyof IDealFilter>;

        keys.forEach(key => {
            if (!(key in this.userInput)) {
                throw new Error(`Unknown user input ${key}`);
            }

            if (values[key] !== undefined) {
                this.userInput[key] = values[key];
            }
        });
    }

    @computed
    public get address() {
        return this.userInput.address || '';
    }

    @computed
    public get filter(): any {
        const result: any = {
            address: {
                $eq: this.address,
            },
        };

        return result;
    }

    @computed
    public get filterAsString(): string {
        return JSON.stringify(this.filter);
    }
}

export default DealFilterStore;
