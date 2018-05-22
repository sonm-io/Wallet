import { IOrder } from 'app/api/types';
import { IOrderFilter } from 'app/stores/order-filter';

export interface IOrdersProps {
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
    filter: IOrderFilter;
}
