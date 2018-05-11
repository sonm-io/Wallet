import { IOrdersListItemProps } from '../../common/orders-list-item/types';
import { IListHeaderProps } from '../../common/list-header/types';

export interface IOrdersProps {
    header: IListHeaderProps;
    list: Array<IOrdersListItemProps>;
}
