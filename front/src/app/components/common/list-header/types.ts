export interface IOrderBy {
    [address: string]: string;
}

/**
 * If some controllable component containes ListHeader, then usualy it exposes this interface.
 */
export interface IListHeader {
    orderBy: string;
    orderDesc: boolean;
    pageLimit: number;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
}

export interface IListHeaderProps extends IListHeader {
    orderKeys: IOrderBy;
    pageLimits: Array<number>;
    className?: string;
}
