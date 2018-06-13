import {
    IListResult,
    IListQuery,
    ISender,
    ISendTransactionResult,
} from '../types';

export class HistoryApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<ISendTransactionResult>> {
        const response = await this.ipc.send('transaction.list', query);
        return response.data;
    }
}

export default HistoryApi;
export { IListQuery, IListResult, ISender };
