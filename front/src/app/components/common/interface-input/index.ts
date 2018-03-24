export interface IInputChangeParams<TValue> {
    name: string;
    value: TValue;
    valueString: string;
}

export interface IInputComponent<TValue> {
    props: {
        onChange: (params: IInputChangeParams<TValue>) => void;
        name: TValue;
        value: TValue;
    };
}
