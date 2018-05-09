import { IListResult, IListQuery, IProfileBrief, ISender } from '../types';
import { TypeProfileList, TypeProfileBrief } from '../runtime-types';

export class ProfileApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IProfileBrief>> {
        const response = await this.ipc.send('profile.list', {
            filters: {},
            limit: query.limit,
            offset: query.offset,
        });

        debugger;

        return TypeProfileList(response.data);
    }

    public async fetcByAddress(address: string): Promise<IProfileBrief> {
        const result = await this.ipc.send('profile.get', {
            address,
        });

        return TypeProfileBrief(result.data);
    }
}

export default ProfileApi;
export { IListQuery, IListResult, IProfileBrief, ISender };
