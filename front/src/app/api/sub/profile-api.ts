import { IListResult, IListQuery, ISender } from '../types';
import { IProfileBrief, IProfileFull } from 'common/types/profile';
import { TypeProfileList, TypeProfileFull } from 'common/types/runtime/profile';

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

    public async fetchByAddress(address: string): Promise<IProfileFull> {
        const response = await this.ipc.send('profile.get', {
            address,
        });

        return TypeProfileFull(response.data);
    }
}

export default ProfileApi;
export { IListQuery, IListResult, IProfileBrief, IProfileFull, ISender };
