import {
    IDeal,
    IListResult,
    ISender,
    IListQuery,
    IMarketStats,
} from '../types';
import { TypeDeal, TypeDealList, TypeDealStats } from '../runtime-types';
import { BN } from 'bn.js';

export class DealApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IDeal>> {
        const response = await this.ipc.send('deal.list', query);

        return TypeDealList(response.data);
    }

    public async fetchById(id: string): Promise<IDeal> {
        const response = await this.ipc.send('deal.get', {
            id,
        });

        return TypeDeal(response.data);
    }

    public fetchStats = async (address: string): Promise<IMarketStats> => {
        const request = {
            filter: JSON.stringify({
                address: {
                    $eq: address,
                },
            }),
            limit: 100,
            offset: 0,
        };

        const response = await this.ipc.send('deal.list', request);
        const deals = TypeDealList(response.data);
        const total = deals.records.reduce((a: BN, b: IDeal) => {
            return a.add(new BN(b.price));
        }, new BN(0));

        return TypeDealStats({
            dealsCount: deals.total,
            dealsPrice: total.toString(),
            daysLeft: 0,
        } as IMarketStats);
    };

    public async close(
        address: string,
        password: string,
        dealId: string,
        isBlacklisted: boolean,
    ) {
        const { data, validation } = await this.ipc.send('market.closeDeal', {
            address,
            id: dealId,
            password,
            isBlacklisted,
        });

        return { data, validation };
    }
}

export default DealApi;
export { IListQuery, IDeal, IListResult, ISender };
