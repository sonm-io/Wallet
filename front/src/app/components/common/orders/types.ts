import { IOrdersListItemProps } from '../orders-list-item/types';
import { IListHeaderProps } from '../list-header/types';

export interface IOrdersProps {
    header: IListHeaderProps;
    list: Array<IOrdersListItemProps>;
}
