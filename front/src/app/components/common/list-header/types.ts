export interface IOrderBy {
    [address: string]: string;
}

export interface IListHeaderProps {
    orderBy: string;
    orderKeys: IOrderBy;
    orderDesc: boolean;
    pageLimit: number;
    pageLimits: Array<number>;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
    //optional
    className?: string;
}
