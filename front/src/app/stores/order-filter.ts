import { observable, computed, action } from 'mobx';
import { EnumProfileStatus, EOrderType, EOrderStatus } from 'app/api/types';

export enum EOrderOwnerType {
    Market = 0,
    My,
}

export interface IOrderFilter {
    orderOwnerType: EOrderOwnerType;
    address: string;
    type: string;
    onlyActive: boolean;
    priceFrom?: string;
    priceTo?: string;
    // owner status:
    professional: boolean;
    registered: boolean;
    identified: boolean;
    anonymous: boolean;
    // -
    cpuCountFrom?: number;
    cpuCountTo?: number;
    gpuCountFrom?: number;
    gpuCountTo?: number;
    ramSizeFrom?: number;
    ramSizeTo?: number;
    storageSizeFrom?: number;
    storageSizeTo?: number;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export class OrderFilterStore implements IOrderFilter, IFilterStore {
    private static defaultUserInput: IOrderFilter = {
        orderOwnerType: EOrderOwnerType.Market,
        address: '',
        type: 'Sell',
        onlyActive: false,
        priceFrom: undefined,
        priceTo: undefined,
        // owner status:
        professional: false,
        registered: false,
        identified: false,
        anonymous: false,
        // -
        cpuCountFrom: undefined,
        cpuCountTo: undefined,
        gpuCountFrom: undefined,
        gpuCountTo: undefined,
        ramSizeFrom: undefined,
        ramSizeTo: undefined,
        storageSizeFrom: undefined,
        storageSizeTo: undefined,
    };

    @observable
    public userInput: IOrderFilter = OrderFilterStore.defaultUserInput;

    @action
    public setUserInput(values: Partial<IOrderFilter>) {
        this.userInput = OrderFilterStore.defaultUserInput;
        this.updateUserInput(values);
    }

    @action
    public updateUserInput(values: Partial<IOrderFilter>) {
        const keys = Object.keys(values) as Array<keyof IOrderFilter>;
        // console.log(values);
        keys.forEach(key => {
            if (!(key in this.userInput)) {
                throw new Error(`Unknown user input ${key}`);
            }

            if (values[key] !== undefined) {
                this.userInput[key] = values[key];
            }
        });
    }

    //#region IOrderFilter

    @computed
    public get orderOwnerType() {
        return this.userInput.orderOwnerType;
    }

    @computed
    public get address() {
        return this.userInput.address;
    }

    @computed
    public get type() {
        return this.userInput.type;
    }

    @computed
    public get onlyActive() {
        return this.userInput.onlyActive;
    }

    @computed
    public get priceFrom() {
        return this.userInput.priceFrom;
    }

    @computed
    public get priceTo() {
        return this.userInput.priceTo;
    }

    @computed
    public get professional() {
        return this.userInput.professional;
    }

    @computed
    public get registered() {
        return this.userInput.registered;
    }

    @computed
    public get identified() {
        return this.userInput.identified;
    }

    @computed
    public get anonymous() {
        return this.userInput.anonymous;
    }

    @computed
    public get cpuCountFrom() {
        return this.userInput.cpuCountFrom;
    }

    @computed
    public get cpuCountTo() {
        return this.userInput.cpuCountTo;
    }

    @computed
    public get gpuCountFrom() {
        return this.userInput.gpuCountFrom;
    }

    @computed
    public get gpuCountTo() {
        return this.userInput.gpuCountTo;
    }

    @computed
    public get ramSizeFrom() {
        return this.userInput.ramSizeFrom;
    }

    @computed
    public get ramSizeTo() {
        return this.userInput.ramSizeTo;
    }

    @computed
    public get storageSizeFrom() {
        return this.userInput.storageSizeFrom;
    }

    @computed
    public get storageSizeTo() {
        return this.userInput.storageSizeTo;
    }

    //#endregion IOrderFilter

    @computed
    public get filter(): any {
        const result: any = {
            address: {
                $eq: this.address,
            },
            creator: {
                address:
                    this.orderOwnerType === EOrderOwnerType.My
                        ? { $eq: this.address }
                        : { $ne: this.address },
                status: {
                    $in: [
                        [EnumProfileStatus.anonimest, true],
                        [EnumProfileStatus.anon, this.anonymous],
                        [EnumProfileStatus.ident, this.identified],
                        [EnumProfileStatus.reg, this.registered],
                        [EnumProfileStatus.pro, this.professional],
                    ]
                        .filter(([n, isEnabled]) => isEnabled)
                        .map(([n, isEnabled]) => n),
                },
            },
            orderType: {
                $eq: this.type === 'Buy' ? EOrderType.BID : EOrderType.ASK,
            },
            orderStatus: {
                $eq: this.onlyActive
                    ? EOrderStatus.Actice
                    : EOrderStatus.Unknown,
            },
            price: {
                $gte: this.priceFrom,
                $lte: this.priceTo,
            },
            benchmarkMap: {
                cpuCount: {
                    $gte: this.cpuCountFrom,
                    $lte: this.cpuCountTo,
                },
                gpuCount: {
                    $gte: this.gpuCountFrom,
                    $lte: this.gpuCountTo,
                },
                ramSize: {
                    $gte: this.ramSizeFrom,
                    $lte: this.ramSizeTo,
                },
                storageSize: {
                    $gte: this.storageSizeFrom,
                    $lte: this.storageSizeTo,
                },
            },
        };
        return result;
    }

    protected getFilterAsString = () => JSON.stringify(this.filter);

    @action
    public applyFilter() {
        this.filterAsStringField = this.getFilterAsString();
    }

    @computed
    public get filterAsString(): string {
        return this.filterAsStringField;
    }

    @observable
    protected filterAsStringField: string = this.getFilterAsString();
}

export default OrderFilterStore;
