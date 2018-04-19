import Api from 'app/api';
import { createListStore } from './list-store-factory';
import { dataFromApiResult } from './utils/data-from-api-result';

export const ProfileList = createListStore({
    fetchList: dataFromApiResult(Api.getProfileList),
});
