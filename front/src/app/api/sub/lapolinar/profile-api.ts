import { IListQuery, ISender } from '../types';
import { IProfile, IProfileInfo } from 'common/types/profile';
import { TypeProfileList, TypeProfileInfo } from 'common/types/runtime/profile';
import { IListResult } from 'common/types';

export class ProfileApi {
    private ipc: ISender;

    constructor(ipc: ISender) {
        this.ipc = ipc;
    }

    public async fetchList(
        query: IListQuery<string>,
    ): Promise<IListResult<IProfile>> {
        const response = await this.ipc.send('profile.list', query);

        return TypeProfileList(response.data);
    }

    public async fetchByAddress(address: string): Promise<IProfileInfo> {
        const response = await this.ipc.send('profile.get', {
            address,
        });

        return TypeProfileInfo(response.data);
    }
}

export default ProfileApi;
export { IListQuery, IListResult, IProfile, IProfileInfo, ISender };
