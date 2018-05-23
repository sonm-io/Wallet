import { observable, computed, action } from 'mobx';
import { EnumProfileStatus, EOrderType, EOrderStatus } from 'app/api/types';

export enum EOrderOwnerType {
    Market = 0,
    My,
}

export interface IOrderFilter {
    orderOwnerType: EOrderOwnerType;
    profileAddress: string;
    sellerAddress: string;
    type: string;
    onlyActive: boolean;
    priceFrom: string;
    priceTo: string;
    // owner status:
    professional: boolean;
    registered: boolean;
    identified: boolean;
    anonymous: boolean;
    // -
    cpuCountFrom: string;
    cpuCountTo: string;
    gpuCountFrom: string;
    gpuCountTo: string;
    ramSizeFrom: string;
    ramSizeTo: string;
    storageSizeFrom: string;
    storageSizeTo: string;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export class OrderFilterStore implements IOrderFilter, IFilterStore {
    private static defaultUserInput: IOrderFilter = {
        orderOwnerType: EOrderOwnerType.Market,
        profileAddress: '',
        sellerAddress: '',
        type: 'Sell',
        onlyActive: false,
        priceFrom: '',
        priceTo: '',
        // owner status:
        professional: false,
        registered: false,
        identified: false,
        anonymous: false,
        // -
        cpuCountFrom: '',
        cpuCountTo: '',
        gpuCountFrom: '',
        gpuCountTo: '',
        ramSizeFrom: '',
        ramSizeTo: '',
        storageSizeFrom: '',
        storageSizeTo: '',
    };

    @observable
    public userInput: IOrderFilter = OrderFilterStore.defaultUserInput;

    @action
    public setUserInput(values: Partial<IOrderFilter>) {
        this.userInput = OrderFilterStore.defaultUserInput;
        this.updateUserInput(values);
        this.applyFilter();
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
                (this.userInput[key] as any) = values[key];
            }
        });
    }

    //#region IOrderFilter

    @computed
    public get orderOwnerType() {
        return this.userInput.orderOwnerType;
    }

    @computed
    public get profileAddress() {
        return this.userInput.profileAddress;
    }

    @computed
    public get sellerAddress() {
        return this.userInput.sellerAddress;
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

    private isValueDefined = (value: string | number | undefined) =>
        value !== undefined && value !== '' && !isNaN(value as number);

    private getGteLte = (
        gte: string | number | undefined,
        lte: string | number | undefined,
    ) => {
        if (this.isValueDefined(gte) && this.isValueDefined(lte)) {
            return {
                $gte: gte,
                $lte: lte,
            };
        }
        return null;
    };

    private getSellerAddress = () => {
        return this.sellerAddress !== '' && !this.sellerAddress.startsWith('0x')
            ? '0x' + this.sellerAddress
            : this.sellerAddress;
    };

    @computed
    public get filter(): any {
        const result: any = {
            creator: {
                address:
                    this.sellerAddress !== ''
                        ? { $eq: this.getSellerAddress() }
                        : this.orderOwnerType === EOrderOwnerType.My
                            ? { $eq: this.profileAddress }
                            : { $ne: this.profileAddress },
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
                    ? EOrderStatus.Active
                    : EOrderStatus.Unknown,
            },
            price: this.getGteLte(this.priceFrom, this.priceTo),
            benchmarkMap: {
                cpuCount: this.getGteLte(
                    parseFloat(this.cpuCountFrom),
                    parseFloat(this.cpuCountTo),
                ),
                gpuCount: this.getGteLte(
                    parseFloat(this.gpuCountFrom),
                    parseFloat(this.gpuCountTo),
                ),
                ramSize: this.getGteLte(
                    parseFloat(this.ramSizeFrom),
                    parseFloat(this.ramSizeTo),
                ),
                storageSize: this.getGteLte(
                    parseFloat(this.storageSizeFrom),
                    parseFloat(this.storageSizeTo),
                ),
            },
        };
        return result;
    }

    protected getFilterAsString = () => JSON.stringify(this.filter);

    @action
    public applyFilter() {
        this.filterAsString = this.getFilterAsString();
    }

    @observable public filterAsString: string = this.getFilterAsString();
}

export default OrderFilterStore;
