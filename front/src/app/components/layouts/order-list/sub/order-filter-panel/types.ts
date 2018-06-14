import { IOrderFilter, IOrderFilterValidation } from 'app/stores/order-filter';

export interface IOrderFilterPanelProps extends IOrderFilter {
    validation: IOrderFilterValidation;
    className?: string;
    onResetFilter: () => void;
    onUpdateFilter: (
        key: keyof IOrderFilter,
        value: IOrderFilter[keyof IOrderFilter],
    ) => void;
}
