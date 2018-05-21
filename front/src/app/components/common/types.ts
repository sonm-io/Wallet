export type TJsPropTypes<T> = { [K in keyof T]: any };

// Changable

export type OnChange<TValue> = (params: IChangeParams<TValue>) => void;

export interface IChengable<TValue> {
    props: IChengableProps<TValue>;
}

export interface IChengableProps<TValue> {
    value: TValue;
    name: string;
    onChange: OnChange<TValue>;
}

export interface IChangeParams<TValue> {
    name: string;
    value: TValue;
    stringValue?: string;
}

// End Changable
