import * as React from 'react';
import { ILocalizedPureComponent } from './types';

export interface IHasGetUiTextMethod<TUiTextSet> {
    getUiText(text: TUiTextSet, args?: any[]): string;
}

export class LocalizedPureComponent<
    TProps extends IHasGetUiTextMethod<TUiTextSet>,
    TState,
    TUiTextSet
> extends React.PureComponent<TProps, TState>
    implements ILocalizedPureComponent<TUiTextSet> {
    public getUiText(text: TUiTextSet, args?: any[]): string {
        return String(
            (this.props.getUiText && this.props.getUiText(text, args)) || text,
        );
    }
}

export * from './types';
