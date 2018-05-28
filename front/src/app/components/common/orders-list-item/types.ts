import { IOrder, IBenchmarkMap } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl?: string;
    className?: string;
    children?: React.ReactNode;
    schemaOfCustomField: Array<[keyof IBenchmarkMap, string]>;
    order: IOrder;
    onClick: (odrer: IOrder) => void;
}
