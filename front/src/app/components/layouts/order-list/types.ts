import { IOrder } from 'app/api/types';

export interface IOrdersProps {
    orderBy: string;
    orderDesc: boolean;
    pageLimit: number;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
    className?: string;
    dataSource: Array<IOrder>;
    schemeOfOrderItem: Array<Array<string>>;
    onRequireQuickBuy: (orderId: string) => void;
}
