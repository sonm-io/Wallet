import { observable, computed, action } from 'mobx';
import {
    EnumProfileStatus,
    EnumOrderType,
    EnumOrderStatus,
} from 'app/api/types';
import { RootStore } from 'app/stores';
import { TypeNotStrictEthereumAddress } from '../api/runtime-types';
import { validatePositiveNumber } from '../utils/validation/validate-positive-number';

export enum EnumOrderOwnerType {
    market,
    my,
}

export interface IOrderFilter {
    orderOwnerType: EnumOrderOwnerType;
    creatorAddress: string;
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
    redshiftFrom: string;
    redshiftTo: string;
    ethFrom: string;
    ethTo: string;
    zcashFrom: string;
    zcashTo: string;
    cpuCountFrom: string;
    cpuCountTo: string;
    gpuCountFrom: string;
    gpuCountTo: string;
    ramSizeFrom: string;
    ramSizeTo: string;
    storageSizeFrom: string;
    storageSizeTo: string;
    gpuRamSizeFrom: string;
    gpuRamSizeTo: string;
}

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export class OrderFilterStore implements IFilterStore {
    private static defaultUserInput: IOrderFilter = {
        orderOwnerType: EnumOrderOwnerType.market,
        creatorAddress: '',
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
        redshiftFrom: '',
        redshiftTo: '',
        ethFrom: '',
        ethTo: '',
        zcashFrom: '',
        zcashTo: '',
        cpuCountFrom: '',
        cpuCountTo: '',
        gpuCountFrom: '',
        gpuCountTo: '',
        ramSizeFrom: '',
        ramSizeTo: '',
        storageSizeFrom: '',
        storageSizeTo: '',
        gpuRamSizeFrom: '',
        gpuRamSizeTo: '',
    };

    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

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
    public get myAddress() {
        return this.rootStore.marketStore.marketAccountAddress;
    }

    @computed
    public get creatorAddress() {
        let result = '';

        if (this.validationCreatorAddress === '') {
            result = this.userInput.creatorAddress;

            if (!result.startsWith('0x')) {
                result = '0x' + result;
            }
        }

        return result;
    }

    @computed
    public get validationCreatorAddress(): string {
        let result = '';

        try {
            TypeNotStrictEthereumAddress(this.userInput.creatorAddress);
        } catch (e) {
            result = 'Incorrect ethereum address'; // TODO use localizator
        }

        return result;
    }

    @computed
    public get type() {
        return this.userInput.type;
    }

    @computed
    public get onlyActive() {
        return this.userInput.onlyActive;
    }

    protected processNumber(input: string): [string | undefined, string] {
        let result;
        let validation = '';
        const validationAsArray = validatePositiveNumber(input);

        if (validationAsArray.length === 0) {
            validation = validationAsArray.join(' ');
        } else {
            result = input;
        }

        return [result, validation];
    }

    @observable public validationPriceFrom: string = '';
    @computed
    public get priceFrom(): string | undefined {
        let result;
        [result, this.validationPriceFrom] = this.processNumber(
            this.userInput.priceFrom,
        );
        return result === undefined ? undefined : String(result); // TODO validate as price string
    }

    @observable public validationPriceTo: string = '';
    @computed
    public get priceTo(): string | undefined {
        let result;
        [result, this.validationPriceTo] = this.processNumber(
            this.userInput.priceFrom,
        );
        return result === undefined ? undefined : String(result); // TODO validate as price string
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

    @observable public validationCpuCountFrom: string = '';
    @computed
    public get cpuCountFrom(): string | undefined {
        let result;
        [result, this.validationCpuCountFrom] = this.processNumber(
            this.userInput.cpuCountFrom,
        );
        return result;
    }

    @observable public validationCpuCountTo: string = '';
    @computed
    public get cpuCountTo(): string | undefined {
        let result;
        [result, this.validationCpuCountTo] = this.processNumber(
            this.userInput.cpuCountTo,
        );
        return result;
    }

    @observable public validationGpuCountFrom: string = '';
    @computed
    public get gpuCountFrom(): string | undefined {
        let result;
        [result, this.validationGpuCountFrom] = this.processNumber(
            this.userInput.gpuCountFrom,
        );
        return result;
    }

    @observable public validationGpuCountTo: string = '';
    @computed
    public get gpuCountTo(): string | undefined {
        let result;
        [result, this.validationGpuCountTo] = this.processNumber(
            this.userInput.gpuCountTo,
        );
        return result;
    }

    @observable public validationRamSizeFrom: string = '';
    @computed
    public get ramSizeFrom(): string | undefined {
        let result;
        [result, this.validationRamSizeFrom] = this.processNumber(
            this.userInput.ramSizeFrom,
        );
        return result;
    }

    @observable public validationRamSizeTo: string = '';
    @computed
    public get ramSizeTo(): string | undefined {
        let result;
        [result, this.validationRamSizeTo] = this.processNumber(
            this.userInput.ramSizeTo,
        );
        return result;
    }

    @observable public validationGpuRamSizeFrom: string = '';
    @computed
    public get gpuRamSizeFrom(): string | undefined {
        let result;
        [result, this.validationGpuRamSizeFrom] = this.processNumber(
            this.userInput.gpuRamSizeFrom,
        );
        return result;
    }

    @observable public validationGpuRamSizeTo: string = '';
    @computed
    public get gpuRamSizeTo(): string | undefined {
        let result;
        [result, this.validationPriceFrom] = this.processNumber(
            this.userInput.gpuRamSizeTo,
        );
        return result;
    }

    @observable public validationStorageSizeFrom: string = '';
    @computed
    public get storageSizeFrom(): string | undefined {
        let result;
        [result, this.validationPriceFrom] = this.processNumber(
            this.userInput.storageSizeFrom,
        );
        return result;
    }

    @observable public validationStorageSizeTo: string = '';
    @computed
    public get storageSizeTo(): string | undefined {
        let result;
        [result, this.validationPriceFrom] = this.processNumber(
            this.userInput.storageSizeTo,
        );
        return result;
    }

    @observable public validationRedshiftFrom: string = '';
    @computed
    public get redshiftFrom(): string | undefined {
        let result;
        [result, this.validationRedshiftFrom] = this.processNumber(
            this.userInput.redshiftFrom,
        );
        return result;
    }

    @observable public validationRedshiftTo: string = '';
    @computed
    public get redshiftTo(): string | undefined {
        let result;
        [result, this.validationRedshiftTo] = this.processNumber(
            this.userInput.redshiftTo,
        );
        return result;
    }

    @observable public validationEthFrom: string = '';
    @computed
    public get ethFrom(): string | undefined {
        let result;
        [result, this.validationEthFrom] = this.processNumber(
            this.userInput.ethFrom,
        );
        return result;
    }

    @observable public validationEthTo: string = '';
    @computed
    public get ethTo(): string | undefined {
        let result;
        [result, this.validationEthTo] = this.processNumber(
            this.userInput.ethTo,
        );
        return result;
    }

    @observable public validationZcashFrom: string = '';
    @computed
    public get zcashFrom(): string | undefined {
        let result;
        [result, this.validationZcashFrom] = this.processNumber(
            this.userInput.zcashFrom,
        );
        return result;
    }

    @observable public validationZcashTo: string = '';
    @computed
    public get zcashTo(): string | undefined {
        let result;
        [result, this.validationZcashTo] = this.processNumber(
            this.userInput.zcashTo,
        );
        return result;
    }

    //#endregion IOrderFilter

    @computed
    public get filter(): any {
        return {
            creator: {
                address:
                    this.creatorAddress !== ''
                        ? { $eq: this.creatorAddress }
                        : this.orderOwnerType === EnumOrderOwnerType.my
                            ? { $eq: this.myAddress }
                            : { $ne: this.myAddress },
                status: {
                    $in: [
                        [EnumProfileStatus.anonimest, this.anonymous],
                        [EnumProfileStatus.ident, this.identified],
                        [EnumProfileStatus.reg, this.registered],
                        [EnumProfileStatus.pro, this.professional],
                    ]
                        .filter(([n, isEnabled]) => isEnabled)
                        .map(([n]) => n),
                },
            },
            orderType: {
                $eq:
                    this.type === 'Buy' ? EnumOrderType.bid : EnumOrderType.ask,
            },
            orderStatus: {
                $eq: this.onlyActive
                    ? EnumOrderStatus.active
                    : EnumOrderStatus.unknown,
            },
            price: {
                $gte: this.priceFrom,
                $lte: this.priceTo,
            },
            benchmarkMap: {
                cpuCount: { $gte: this.cpuCountFrom, $lte: this.cpuCountTo },
                gpuCount: { $gte: this.gpuCountFrom, $lte: this.gpuCountTo },
                ramSize: { $gte: this.ramSizeFrom, $lte: this.ramSizeTo },
                gpuRamSize: {
                    $gte: this.gpuRamSizeFrom,
                    $lte: this.gpuRamSizeTo,
                },
                redshiftGpu: { $gte: this.redshiftFrom, $lte: this.redshiftTo },
                ethHashrate: { $gte: this.ethFrom, $lte: this.ethTo },
                zcashHashrate: { $gte: this.zcashFrom, $lte: this.zcashTo },
                storageSize: {
                    $gte: this.storageSizeFrom,
                    $lte: this.storageSizeTo,
                },
            },
            profileAddress: {
                $eq: this.myAddress,
            },
        };
    }

    protected getFilterAsString = () => JSON.stringify(this.filter);

    @action
    public applyFilter() {
        this.filterAsString = this.getFilterAsString();
    }

    @observable public filterAsString: string = this.getFilterAsString();
}

export default OrderFilterStore;
