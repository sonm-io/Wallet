export interface IOrderBy {
    [address: string]: string;
}

export interface IPageLimits {
    pageLimit: number;
    onChangeLimit: (limit: number) => void;
}

export interface IOrderable {
    orderBy: string;
    orderDesc: boolean;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
}

export interface IListHeaderProps extends IOrderable, Partial<IPageLimits> {
    className?: string;
    orderKeys: IOrderBy;
    onRefresh?: () => void;
    pageLimits?: Array<number>;
}
