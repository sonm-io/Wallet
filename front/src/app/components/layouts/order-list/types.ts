import { IBenchmarkMap, IOrder } from 'app/api/types';
import { IOrderFilter, EnumOrderOwnerType } from 'app/stores/order-filter';

interface IFilter {
    filterOrderOwnerType: EnumOrderOwnerType;
    filterProfileAddress: string;
    filterSellerAddress: string;
    filterType: string;
    filterOnlyActive: boolean;
    filterPriceFrom: string;
    filterPriceTo: string;
    // owner status:
    filterProfessional: boolean;
    filterRegistered: boolean;
    filterIdentified: boolean;
    filterAnonymous: boolean;
    // -
    filterRedshiftFrom: string;
    filterRedshiftTo: string;
    filterEthFrom: string;
    filterEthTo: string;
    filterZCashFrom: string;
    filterZCashTo: string;
    filterCpuCountFrom: string;
    filterCpuCountTo: string;
    filterGpuCountFrom: string;
    filterGpuCountTo: string;
    filterRamSizeFrom: string;
    filterRamSizeTo: string;
    filterStorageSizeFrom: string;
    filterStorageSizeTo: string;
    filterGpuRamSizeFrom: string;
    filterGpuRamSizeTo: string;
}

export interface IOrdersProps extends IFilter {
    orderBy: string;
    orderDesc: boolean;
    pageLimit: number;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
    className?: string;
    dataSource: Array<IOrder>;
    schemaOfOrderItem: Array<[keyof IBenchmarkMap, string]>;
    onClickRow: (orderId: string) => void;
    onApplyFilter: () => void;
    onUpdateFilter: (
        key: keyof IOrderFilter,
        value: IOrderFilter[keyof IOrderFilter],
    ) => void;
}
