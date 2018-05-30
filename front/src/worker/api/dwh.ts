import * as t from './types';
// import { IAttribute } from '../../app/api/types';
import * as mapKeys from 'lodash/fp/mapKeys';
import * as pick from 'lodash/fp/pick';
import { TypeEthereumAddress } from '../../app/api/runtime-types';
import * as tcomb from 'tcomb';
import { BN } from 'bn.js';
import { EnumProfileStatus, IBenchmarkMap } from '../../app/api/types';
import * as moment from 'moment';

interface IDictionary<T> {
    [index: string]: keyof T;
}

const ATTRIBUTE_DESCRIPTION = 1103;

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
        activeAsks: 'sellOrders',
        activeBids: 'buyOrders',
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

    public static readonly mapParseAttributes: any = {
        1102: ['name', self.atob],
        1201: ['kyc2', self.atob],
        1301: ['kyc3', self.atob],
        1401: ['kyc4', self.atob],
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
        tcomb.maybe(tcomb.String)(filter);
        tcomb.Number(limit);
        tcomb.Number(offset);

        const mongoLikeFilter = filter ? JSON.parse(filter) : {};

        const res = await this.fetchData('GetProfiles', {
            offset,
            limit,
            name:
                mongoLikeFilter.query && mongoLikeFilter.query.$like
                    ? `%${mongoLikeFilter.query.$like}%`
                    : null,
            country:
                mongoLikeFilter.country && mongoLikeFilter.country.$in.length
                    ? mongoLikeFilter.country.$in[0].toLowerCase()
                    : null,
            identityLevel:
                !mongoLikeFilter.status || mongoLikeFilter.status.$gte <= 1
                    ? 0
                    : mongoLikeFilter.status.$gte,
            role: mongoLikeFilter.role ? mongoLikeFilter.role.$eq : 0,
        });

        return {
            records: res.profiles ? res.profiles.map(this.processProfile) : [],
            total: res && res.count ? res.count : 0,
        };
    };

    public getProfileFull = async ({
        address,
    }: any): Promise<t.IProfileFull> => {
        TypeEthereumAddress(address);

        const res = await this.fetchData('GetProfileInfo', { Id: address });
        const brief = this.processProfile(res);
        const certificates = res.Certificates
            ? JSON.parse(res.Certificates)
            : [];
        const attrMap: any = {};
        const attributes = certificates
            .map((x: any) => {
                attrMap[x.attribute] = x;

                if (x.attribute in DWH.mapAttributes) {
                    const [label, converter] = DWH.mapAttributes[x.attribute];

                    return {
                        value: converter(x.value),
                        label,
                    };
                }
                return undefined;
            })
            .filter(Boolean);

        const description =
            ATTRIBUTE_DESCRIPTION in attrMap
                ? self.atob(attrMap[ATTRIBUTE_DESCRIPTION].value)
                : '';

        return {
            ...brief,
            attributes,
            description,
        };
    };

    public getOrders = async ({
        limit,
        offset,
        filter,
        sortBy,
        sortDesc,
    }: t.IListQuery): Promise<t.IListResult<t.IOrder>> => {
        tcomb.Number(limit);
        tcomb.Number(offset);
        tcomb.maybe(tcomb.String)(filter);
        tcomb.maybe(tcomb.String)(sortBy);
        tcomb.maybe(tcomb.Boolean)(sortDesc);

        let sortField = 'Id';
        switch (sortBy) {
            case 'price':
                sortField = 'Price';
                break;
            case 'duration':
                sortField = 'Duration';
                break;
            case 'cpuCount':
                sortField = 'Benchmark2';
                break;
            case 'gpuCount':
                sortField = 'Benchmark7';
                break;
            case 'hashrate':
                sortField = 'Benchmark9';
                break;
            case 'ramSize':
                sortField = 'Benchmark11';
                break;
        }

        const mongoLikeQuery = filter ? JSON.parse(filter) : {};
        const res = await this.fetchData('GetOrders', {
            // filter
            authorID:
                mongoLikeQuery.creator.address &&
                mongoLikeQuery.creator.address.$eq
                    ? mongoLikeQuery.creator.address.$eq
                    : null,
            type:
                typeof mongoLikeQuery.orderType.$eq === 'number'
                    ? mongoLikeQuery.orderType.$eq
                    : null,
            status:
                typeof mongoLikeQuery.orderStatus.$eq === 'number'
                    ? mongoLikeQuery.orderStatus.$eq
                    : null,
            price: this.getMinMaxFilter(mongoLikeQuery.price),
            benchmarks: this.getBenchmarksFilter(mongoLikeQuery.benchmarkMap),
            // end filter
            offset,
            limit,
            sortings: [
                {
                    field: sortField,
                    order: sortDesc ? 1 : 0,
                },
            ],
        });
        const records = [] as t.IOrder[];

        if (res && res.orders) {
            for (const item of res.orders) {
                records.push(this.parseOrder(item));
            }
        }

        return {
            records,
            total: res && res.count ? res.count : 0,
        };
    };

    protected typeIn = (value: any, types: Array<string>) =>
        types.some(i => typeof value === i);

    protected getBenchmarksFilter = (benchmarkMap: any) => {
        const map: Array<[number, string]> = [
            [2, 'cpuCount'],
            [7, 'gpuCount'],
            [3, 'ramSize'],
            [4, 'storageSize'],
        ];

        return map
            .map(
                ([i, name]) =>
                    [i, name, this.getMinMaxFilter(benchmarkMap[name])] as [
                        number,
                        string,
                        any
                    ],
            )
            .filter(([i, name, value]) => value !== null)
            .reduce(
                (acc, [i, name, value]) => {
                    acc[i] = value;
                    return acc;
                },
                {} as any,
            );
    };

    protected getMinMaxFilter = (value: any) => {
        if (value) {
            const types = ['string', 'number'];
            const min = value.$gte;
            const max = value.$lte;
            if (this.typeIn(min, types) && this.typeIn(max, types)) {
                return {
                    min,
                    max,
                };
            }
        }
        return null;
    };

    public getOrderFull = async ({ id }: any): Promise<t.IOrder> => {
        const res = await this.fetchData('GetOrderDetails', id);
        return this.parseOrder(res);
    };

    private parseBenchmarks(benchmarks: any): IBenchmarkMap {
        return {
            cpuSysbenchMulti: benchmarks.values[0] || 0,
            cpuSysbenchOne: benchmarks.values[1] || 0,
            cpuCount: benchmarks.values[2] || 0,
            ramSize: Math.round(benchmarks.values[3] / (1024 * 1024)) || 0,
            storageSize: Math.round(benchmarks.values[4] / (1024 * 1024)) || 0,
            downloadNetSpeed:
                Math.round(benchmarks.values[5] / (1024 * 1024)) || 0,
            uploadNetSpeed:
                Math.round(benchmarks.values[6] / (1024 * 1024)) || 0,
            gpuCount: benchmarks.values[7] || 0,
            gpuRamSize: Math.round(benchmarks.values[8] / (1024 * 1024)) || 0,
            ethHashrate: benchmarks.values[9] || 0,
            zcashHashrate: benchmarks.values[10] || 0,
            redshiftGpu: benchmarks.values[11] || 0,
        };
    }

    private parseOrder(item: any): t.IOrder {
        const order = {
            ...item.order,
        };

        order.benchmarkMap = this.parseBenchmarks(item.order.benchmarks);
        order.duration = order.duration
            ? this.parseDuration(order.duration)
            : 0;
        order.price = this.parsePrice(order.price);

        order.creator = {
            status: item.creatorIdentityLevel || EnumProfileStatus.anonimest,
            name: item.creatorName || '',
            address: order.authorID,
        };

        return order;
    }

    private parsePrice(price: number) {
        return new BN(price).mul(new BN(3600)).toString();
    }

    private parseDuration(duration: number) {
        return Math.round(100 * duration / 3600) / 100;
    }

    public getDealFull = async ({ id }: any): Promise<t.IDeal> => {
        const response = await fetch(`${this.url}GetDealDetails`, {
            method: 'POST',
            body: `"${id}"`,
        });
        const json = await response.json();
        return this.parseDeal(json);
    };

    public getDeals = async ({
        limit,
        offset,
        filter,
    }: t.IListQuery): Promise<t.IListResult<t.IDeal>> => {
        tcomb.Number(limit);
        tcomb.Number(offset);
        tcomb.maybe(tcomb.String)(filter);

        const mongoLikeQuery = filter ? JSON.parse(filter) : {};
        const res = await this.fetchData('GetDeals', {
            offset,
            consumerID: mongoLikeQuery.address
                ? mongoLikeQuery.address.$eq
                : null,
            supplierID:
                mongoLikeQuery.query && mongoLikeQuery.query.$like
                    ? `${mongoLikeQuery.query.$like}`
                    : null,
            limit,
            sortings: [
                {
                    field: 'StartTime',
                    order: 1,
                },
            ],
        });
        const records = [] as t.IDeal[];

        if (res && res.deals) {
            for (const item of res.deals) {
                records.push(this.parseDeal(item));
            }
        }

        return {
            records,
            total: res && res.count ? res.count : 0,
        };
    };

    private parseCertificate(data: string): any {
        const attrMap = {} as any;

        try {
            JSON.parse(self.atob(data)).map((x: any) => {
                if (x.attribute in DWH.mapParseAttributes) {
                    const [label, converter] = DWH.mapParseAttributes[
                        x.attribute
                    ];
                    attrMap[label] = converter(x.value);
                }
            });

            if (attrMap.kyc4) {
                attrMap.status = EnumProfileStatus.pro;
            } else if (attrMap.kyc3) {
                attrMap.status = EnumProfileStatus.ident;
            }
        } catch {}

        return attrMap;
    }

    private parseDeal(item: any): t.IDeal {
        const deal = {
            ...item.deal,
            ...this.parseBenchmarks(item.deal.benchmarks),
        };

        const consumer = this.parseCertificate(item.consumerCertificates);
        const supplier = this.parseCertificate(item.supplierCertificates);

        deal.benchmarkMap = this.parseBenchmarks(item.deal.benchmarks);
        deal.supplier = {
            address: deal.supplierID,
            status: supplier.status || EnumProfileStatus.anonimest,
            name: supplier.name || '',
        };
        deal.consumer = {
            address: deal.consumerID,
            status: consumer.status || EnumProfileStatus.anonimest,
            name: consumer.name || '',
        };
        deal.duration = deal.duration ? this.parseDuration(deal.duration) : 0;
        deal.price = this.parsePrice(deal.price) || 0;
        deal.startTime =
            deal.startTime && deal.startTime.seconds
                ? deal.startTime.seconds
                : 0;
        deal.endTime =
            deal.endTime && deal.endTime.seconds ? deal.endTime.seconds : 0;

        const now = moment().unix();
        deal.timeLeft =
            deal.endTime && now < deal.endTime
                ? Math.round((deal.endTime - now) / 3600)
                : 0;

        return deal;
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
