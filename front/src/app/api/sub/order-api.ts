import {
    IOrder,
    IListResult,
    ISender,
    IListQuery,
    IOrderParams,
} from '../types';
import { TypeOrder, TypeOrderList, TypeOrderParams } from '../runtime-types';

export class OrderApi {
    private ipc: ISender;

    public static defaultOrder = {
        id: '',
        orderType: 0,
        creatorStatus: 0,
        creatorName: '',
        price: '0',
        duration: 0,
        orderStatus: 0,
        authorID: '0x',
        cpuCount: 0,
        gpuCount: 0,
        hashrate: 0,
        ramSize: 0,
        creator: {
            address: '0x',
        },
    };

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IOrder>> {
        const response = await this.ipc.send('order.list', query);

        return TypeOrderList({ ...response.data, ...OrderApi.defaultOrder });
    }

    public async fetchById(id: string): Promise<IOrder> {
        const response = await this.ipc.send('order.get', {
            id,
        });

        return TypeOrder({ ...response.data, ...OrderApi.defaultOrder });
    }

    public async quickBuy(address: string, password: string, orderId: string) {
        const { data, validation } = await this.ipc.send('market.buyOrder', {
            address,
            id: orderId,
            password,
        });

        return { data, validation };
    }

    public async getOrderParams(
        address: string,
        id: string,
    ): Promise<IOrderParams> {
        const response = await this.ipc.send('market.getOrderParams', {
            address,
            id,
        });
        return TypeOrderParams(response.data);
    }

    public async waitForDeal(
        address: string,
        id: string,
    ): Promise<IOrderParams> {
        const response = await this.ipc.send('market.waitForOrderDeal', {
            address,
            id,
        });
        return TypeOrderParams(response.data);
    }
}

export default OrderApi;
export { IListQuery, IOrder, IListResult, ISender };
