import * as React from 'react';
import * as cn from 'classnames';

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
                <svg className="sonm-load-mask__spin-svg">
                    <path className="sonm-load-mask__spin-path sonm-load-mask__spin-path--first" d="M75,121.2c-25.5,0-46.2-20.7-46.2-46.2c0-25.5,20.7-46.2,46.2-46.2s46.2,20.7,46.2,46.2C121.2,100.5,100.5,121.2,75,121.2z M75,42.8c-17.7,0-32.2,14.4-32.2,32.2c0,17.7,14.4,32.2,32.2,32.2s32.2-14.4,32.2-32.2C107.2,57.3,92.7,42.8,75,42.8z"/>
                    <path className="sonm-load-mask__spin-path sonm-load-mask__spin-path--second" d="M75,121.2c-25.5,0-46.2-20.7-46.2-46.2c0-25.5,20.7-46.2,46.2-46.2s46.2,20.7,46.2,46.2c0,3.9-3.1,7-7,7s-7-3.1-7-7c0-17.7-14.4-32.2-32.2-32.2S42.8,57.3,42.8,75c0,17.7,14.4,32.2,32.2,32.2c3.9,0,7,3.1,7,7S78.9,121.2,75,121.2z"/>
                    <path className="sonm-load-mask__spin-path sonm-load-mask__spin-path--third" d="M75,121.2c-25.5,0-46.2-20.7-46.2-46.2c0-25.5,20.7-46.2,46.2-46.2c3.9,0,7,3.1,7,7s-3.1,7-7,7c-17.7,0-32.2,14.4-32.2,32.2c0,17.7,14.4,32.2,32.2,32.2c3.9,0,7,3.1,7,7S78.9,121.2,75,121.2z"/>
                </svg>
            </div>,
            children,
        ];
    }
}

export default LoadMask;
