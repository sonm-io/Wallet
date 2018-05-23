import { IOrder } from 'app/api/types';
import { IOrderFilter, EOrderOwnerType } from 'app/stores/order-filter';

interface IFilter {
    filterOrderOwnerType: EOrderOwnerType;
    filterAddress: string;
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
    filterCpuCountFrom: string;
    filterCpuCountTo: string;
    filterGpuCountFrom: string;
    filterGpuCountTo: string;
    filterRamSizeFrom: string;
    filterRamSizeTo: string;
    filterStorageSizeFrom: string;
    filterStorageSizeTo: string;
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
    schemaOfOrderItem: Array<Array<string>>;
    onRequireQuickBuy: (orderId: string) => void;
    onApplyFilter: () => void;
    onUpdateFilter: (
        key: keyof IOrderFilter,
        value: IOrderFilter[keyof IOrderFilter],
    ) => void;
}
