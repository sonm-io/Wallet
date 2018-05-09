import * as t from './types';
// import { IAttribute } from '../../app/api/types';
import * as mapKeys from 'lodash/fp/mapKeys';
import * as pick from 'lodash/fp/pick';

interface IDictionary<T> {
    [index: string]: keyof T;
}

export class DWH {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public static readonly mapProfile: IDictionary<t.IProfileBrief> = {
        UserID: 'address',
        IdentityLevel: 'status',
        Name: 'name',
        Country: 'country',
        activeAsks: 'buyOrders',
        activeBids: 'sellOrders',
    };
    public static renameProfileKeys = mapKeys((x: string) => DWH.mapProfile[x]);
    public static pickProfileKeys = pick(
        (Object as any).values(DWH.mapProfile),
    );

    public static readonly defaultProfile: t.IProfileBrief = {
        name: '',
        address: '0x0',
        status: t.EnumProfileStatus.anonimest,
        sellOrders: 0,
        buyOrders: 0,
        deals: 0,
        country: '',
        logoUrl: '',
    };

    public static readonly mapAttributes = {
        1201: ['Website', self.atob],
        2201: ['Telephone', self.atob],
        2202: ['E-mail', self.atob],
        2203: ['Service link', self.atob],
    };

    private processProfile(item: any): t.IProfileBrief {
        const renamed = DWH.renameProfileKeys(item);
        const picked = DWH.pickProfileKeys(renamed);
        const result = { ...DWH.defaultProfile, ...picked };

        return result as t.IProfileBrief;
    }

    public getProfiles = async (): Promise<t.IListResult<t.IProfileBrief>> => {
        const res = await this.fetchData('GetProfiles');

        return {
            records: res.profiles.map(this.processProfile),
            total: 4,
        };
    };

    public getProfileFull = async (
        address: string,
    ): Promise<t.IProfileBrief> => {
        const res = await this.fetchData('GetProfileInfo', { Id: address });
        const brief = this.processProfile(res);
        const full = { ...brief, attributes: [] }; // TODO

        return full as any; // TODO
    };

    public getOrders = async (): Promise<t.IOrderListResult> => {
        const res = await this.fetchData('GetOrders');
        const records = [] as t.IOrder[];

        if (res && res.orders) {
            for (const item of res.orders) {
                records.push(this.parseOrder(item));
            }
        }

        return {
            records,
        };
    };

    public getOrder = async (address: string): Promise<t.IOrder> => {
        const res = await this.fetchData('GetOrderDetails', { Id: address });
        return this.parseOrder(res);
    };

    private parseOrder(item: any): t.IOrder {
        return item.order as t.IOrder;
    }

    private async fetchData(method: string, params: any = {}) {
        const response = await fetch(`${this.url}${method}`, {
            method: 'POST',
            body: JSON.stringify(params),
        });

        if (response && response.status === 200) {
            return response.json();
        } else {
            return false;
        }
    }
}
