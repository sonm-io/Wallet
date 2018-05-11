import { IDeal, IListResult, ISender, IListQuery } from '../types';
import { TypeDeal, TypeDealList } from '../runtime-types';

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
}

export default DealApi;
export { IListQuery, IDeal, IListResult, ISender };
