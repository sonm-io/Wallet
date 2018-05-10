import { IOrder, IListResult, ISender, IListQuery } from '../types';
import { TypeOrder, TypeOrderList } from '../runtime-types';

export class OrderApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IOrder>> {
        const response = await this.ipc.send('order.list', query);

        return TypeOrderList(response.data);
    }

    public async fetchById(id: string): Promise<IOrder> {
        const response = await this.ipc.send('order.get', {
            id,
        });

        return TypeOrder(response.data);
    }
}

export default OrderApi;
export { IListQuery, IOrder, IListResult, ISender };
