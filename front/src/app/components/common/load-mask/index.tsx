import * as React from 'react';
import * as cn from 'classnames';
import { Spinner } from '../spinner';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    className?: string;
    visible?: boolean;
    children: any;
    white?: boolean;
}

export class LoadMask extends React.PureComponent<IButtonProps> {
    public render() {
        const {
            className,
            visible,
            children,
            white,
        } = this.props;

        return [
            <div
                className={cn(
                    className,
                    'sonm-load-mask', {
                        'sonm-load-mask--visible': visible,
                        'sonm-load-mask--white': white,
                    })}
                key="lm"
            >
                <div className="sonm-load-mask__pale" />
                <Spinner className="sonm-load-mask__spinner" />
            </div>,
            children,
        ];
    }
}

export default LoadMask;
