import { IListQuery, ISender, ISendTransactionResult } from '../types';
import { IListResult } from 'common/types';

export class HistoryApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<ISendTransactionResult>> {
        const response = await this.ipc.send('transaction.list', query);
        // TODO add json scheme validation
        return response.data;
    }
}

export default HistoryApi;
export { IListQuery, IListResult, ISender };
