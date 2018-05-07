export interface IListHeaderProps {
    orderBy: string;
    orderKeys: Array<string>;
    desc: boolean;
    limit: number;
    limits: Array<number>;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
    //optional
    className?: string;
}
