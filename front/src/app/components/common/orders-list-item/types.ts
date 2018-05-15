import { IOrder } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl?: string;
    className?: string;
    children?: React.ReactNode;
    schemaOfCustomField: Array<Array<string>>;
    order: IOrder;
}
