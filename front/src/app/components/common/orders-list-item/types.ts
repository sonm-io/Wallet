import { IOrder } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl?: string;
    className?: string;
    children?: React.ReactNode;
    order: IOrder;
    onClick: (odrer: IOrder) => void;
}
