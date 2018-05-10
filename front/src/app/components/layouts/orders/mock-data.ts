import { EnumProfileStatus } from 'app/api/types';
import { IOrdersListItemProps } from 'app/components/common/orders-list-item/types';

const data: Array<IOrdersListItemProps> = [
    {
        address: '0x0',
        name: 'Vasian Home Mining Inc',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EnumProfileStatus.ident,
        customFields: new Map([
            ['CPU Count', '3'],
            ['GPU ETH hashrate', '80.1 Mh/s'],
            ['RAM size', '1024 Mb'],
        ]),
        usdPerHour: '8',
        duration: 1000,
    },
    {
        address: '0x0',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b53',
        status: EnumProfileStatus.pro,
        customFields: new Map([
            ['CPU Count', '2'],
            ['GPU ETH hashrate', '180.1 Mh/s'],
            ['RAM size', '2048 Mb'],
        ]),
        usdPerHour: '120',
        duration: 50,
    },
    {
        address: '0x0',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b54',
        status: EnumProfileStatus.pro,
        customFields: new Map([
            ['CPU Count', '6'],
            ['GPU ETH hashrate', '211.22 Mh/s'],
            ['RAM size', '4096 Mb'],
        ]),
        usdPerHour: '9',
        duration: 5,
    },
];

const getSorted = (
    data: Array<IOrdersListItemProps>,
    sortField: string,
    isDesc: boolean,
) => {
    let list = data;
    let sortFactor = isDesc ? -1 : 1;
    switch (sortField) {
        case 'CPU Count':
        case 'GPU ETH hashrate':
        case 'RAM size':
            list = list.sort((a, b) => {
                let result =
                    (a.customFields.get(sortField) as any) >
                    (b.customFields.get(sortField) as any);
                return (result ? 1 : -1) * sortFactor;
            });
            break;
        case 'Cost':
            list = list.sort(
                (a, b) => (a.usdPerHour > b.usdPerHour ? 1 : -1) * sortFactor,
            );
            break;
        case 'Lease duration':
            list = list.sort((a, b) => (a.duration - b.duration) * sortFactor);
            break;
        default:
            throw new Error('Not implemented sort field: ' + sortField);
    }
    return list;
};

export { data, getSorted };
