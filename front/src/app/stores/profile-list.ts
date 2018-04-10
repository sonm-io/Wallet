import Api from 'app/api';
import { createListStore } from './list-store-factory';

export const ProfileList = createListStore({ fetchList: Api.getProfileList });
