import {
    IListResult,
    IListQuery,
    IProfileBrief,
    ISender,
    IProfileFull,
} from '../types';
import { TypeProfileList, TypeProfileFull } from '../runtime-types';

export class ProfileApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IProfileBrief>> {
        const response = await this.ipc.send('profile.list', query);

        return TypeProfileList(response.data);
    }

    public async fetcByAddress(address: string): Promise<IProfileFull> {
        const response = await this.ipc.send('profile.get', {
            address,
        });

        return TypeProfileFull(response.data);
    }
}

export default ProfileApi;
export { IListQuery, IListResult, IProfileBrief, IProfileFull, ISender };
