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
        usdPerHour: 8,
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
        usdPerHour: 120,
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
        usdPerHour: 9,
        duration: 5,
    },
];

export { data };
