import { observable, computed, action } from 'mobx';
import { EProfileStatus, EProfileRole } from '../api/types';

export interface IOrderFilter {
    status: EProfileStatus;
    role: EProfileRole;
    country: string;
    minDeals: string;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export interface IUserInput {
    [key: string]: string;
}

export class ProfileFilterStore implements IOrderFilter, IFilterStore {
    @observable public userInput: IUserInput = {};

    @action
    public setUserInput(values: Partial<IUserInput>) {
        const keys = Object.keys(values) as Array<keyof IUserInput>;

        keys.forEach(key => {
            if (values[key] !== undefined) {
                this.userInput[key] = String(values[key]);
            }
        });
    }

    @computed
    public get status(): EProfileStatus {
        return Number(this.userInput.status) || EProfileStatus.anon;
    }

    @computed
    public get role(): EProfileRole {
        return Number(this.userInput.role) || EProfileRole.customer;
    }

    @computed
    public get country() {
        return this.userInput.country || '';
    }

    @computed
    public get minDeals() {
        return this.userInput.minDeals;
    }

    @computed
    public get filter(): any {
        return {
            identityLevel: this.status.valueOf(),
            role: this.role.valueOf(),
            country: this.country,
        };
    }

    @computed
    public get filterAsString(): string {
        return JSON.stringify(this.filter);
    }
}

export default ProfileFilterStore;
