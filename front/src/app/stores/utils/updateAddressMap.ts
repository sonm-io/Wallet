import { IHasAddress } from '../types';

export function updateAddressMap<T extends IHasAddress>(list: T[], map: Map<string, T>): void {
    // TODO compare with existing values
    list.forEach(item  => map.set(item.address, item));
}

export default updateAddressMap;
