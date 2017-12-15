import * as React from 'react';
import * as cn from 'classnames';
import { Spinner } from '../spinner';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    className?: string;
    visible?: boolean;
    children: any;
}

export class LoadMask extends React.PureComponent<IButtonProps> {
    public render() {
        const {
            className,
            visible,
            children,
        } = this.props;

        return [
            <div
                className={cn(className, 'sonm-load-mask', { 'sonm-load-mask--visible': visible })}
                key="lm"
            >
                <Spinner />
            </div>,
            children,
        ];
    }
}

export default LoadMask;
