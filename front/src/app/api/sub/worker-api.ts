import { IWorker, ISender, IListQuery } from '../types';
import { TypeWorkerList } from '../runtime-types';
import { IListResult } from 'common/types';

export class WorkerApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IWorker>> {
        const response = await this.ipc.send('worker.list', query);

        return TypeWorkerList(response.data);
    }

    public async confirm(password: string, address: string, slaveId: string) {
        const { data, validation } = await this.ipc.send('worker.confirm', {
            address,
            slaveId,
            password,
        });

        return { data, validation };
    }
}

export default WorkerApi;
export { IListQuery, IListResult, ISender };
