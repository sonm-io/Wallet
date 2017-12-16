import { IHasAddress } from '../types';

export function listToAddressMap<T extends IHasAddress>(list: T[], map: Map<string, T>): void {
    list.forEach(item  => map.set(item.address, item));
}

export default listToAddressMap;
