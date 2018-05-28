import { IOrderFilter } from 'app/stores/order-filter';

export interface IOrderFilterPanelProps extends IOrderFilter {
    className?: string;
    onApply: () => void;
    onUpdateFilter: (
        key: keyof IOrderFilter,
        value: IOrderFilter[keyof IOrderFilter],
    ) => void;
}
