export interface IInputChangeParams {
    name: string;
    value: any;
    valueString: string;
}

export interface IInputComponent<TValue> {
    props: {
        onChange: (params: IInputChangeParams) => void;
        name: TValue;
        value: TValue;
    };
}
