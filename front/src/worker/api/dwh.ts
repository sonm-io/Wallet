import * as t from './types';
import { IAttribute } from '../../app/api/types';

interface IDictionary {
    [index: string]: string;
}

export class DWH {
    public structureConverter = {
        UserID: 'address',
        IdentityLevel: 'status',
        Name: 'name',
        Country: 'country',
        IsCorporation: 'isCorp',
        IsProfessional: 'isPro',
        activeAsks: 'buyOrders',
        activeBids: 'sellOrders',
        Certificates: 'certificates',
    } as IDictionary;

    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public getProfiles = async (): Promise<t.IListResult<t.IProfileBrief>> => {
        const res = await this.fetchData('GetProfiles');
        const records = [] as t.IProfileBrief[];

        if (res && res.profiles) {
            for (const item of res.profiles) {
                records.push(this.parseProfile(item));
            }
        }

        return {
            records,
            total: 4,
        };
    };

    public getProfile = async (address: string): Promise<t.IProfileBrief> => {
        const res = await this.fetchData('GetProfileInfo', { Id: address });
        return this.parseProfile(res);
    };

    private parseProfile(item: any): t.IProfileBrief {
        const structureConverter = {
            UserID: 'address',
            IdentityLevel: 'status',
            Name: 'name',
            Country: 'country',
            IsCorporation: 'isCorp',
            IsProfessional: 'isPro',
            activeAsks: 'buyOrders',
            activeBids: 'sellOrders',
            Certificates: 'certificates',
        } as IDictionary;

        const attributesConverter = {
            1201: 'Website',
            2201: 'Telephone',
            2202: 'E-mail',
            2203: 'Service link',
        } as IDictionary;

        for (const key of Object.keys(structureConverter)) {
            const newKey = structureConverter[key];

            if (item[key] !== '') {
                if (key === 'Certificates') {
                    item.attributes = [] as IAttribute[];
                    const parsed = JSON.parse(item.Certificates);

                    for (const row of parsed) {
                        if (row.value) {
                            try {
                                if (attributesConverter[row.attribute]) {
                                    item.attributes.push({
                                        label:
                                            attributesConverter[row.attribute],
                                        value: self.atob(row.value),
                                    });
                                } else {
                                    item.attributes.push({
                                        label: row.attribute,
                                        value: self.atob(row.value),
                                    });
                                }
                            } catch (err) {
                                console.log(err);
                                console.log(
                                    `Incorrect attr ${row.attribute} value ${
                                        row.value
                                    }`,
                                );
                            }
                        }
                    }
                } else {
                    item[newKey] = item[key];
                }
            } else {
                if (newKey === 'country') {
                    item[newKey] = '';
                } else {
                    item[newKey] = 0;
                }
            }
            delete item[key];
        }

        return item as t.IProfileBrief;
    }

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
