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

    public static readonly mapAttributes: any = {
        1201: ['KYC 2', self.atob],
        1202: ['Website', self.atob],
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

    public getProfiles = async ({
        filter,
        limit,
        offset,
    }: t.IListQuery): Promise<t.IListResult<t.IProfileBrief>> => {
        const mongoLikeFilter = filter ? JSON.parse(filter) : {};

        const res = await this.fetchData('GetProfiles', {
            offset,
            limit,
            name: mongoLikeFilter.query.$eq,
            country: mongoLikeFilter.country.$in.length
                ? mongoLikeFilter.country.$in[0].toLowerCase()
                : null,
            identityLevel:
                mongoLikeFilter.status.$gte <= 1
                    ? 0
                    : mongoLikeFilter.status.$gte,
        });

        return {
            records: res.profiles ? res.profiles.map(this.processProfile) : [],
            total: 100,
        };
    };

    public getProfileFull = async ({
        address,
    }: any): Promise<t.IProfileFull> => {
        const res = await this.fetchData('GetProfileInfo', { Id: address });
        const brief = this.processProfile(res);
        const full = {
            ...brief,
            attributes: res.Certificates
                ? JSON.parse(res.Certificates)
                      .map((x: any) => {
                          if (x.attribute in DWH.mapAttributes) {
                              const [label, converter] = DWH.mapAttributes[
                                  x.attribute
                              ];

                              return {
                                  value: converter(x.value),
                                  label,
                              };
                          }
                          return undefined;
                      })
                      .filter((x: any) => x !== undefined)
                : [],
        };

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
