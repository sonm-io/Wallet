import * as React from 'react';
import * as cn from 'classnames';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    color?: string;
    transparent?: boolean;
    square?: boolean;
    children?: any;
    height?: number;
    type?: string;
}

export function Button({ color = 'blue', square, transparent, children, height, type, className, ...rest }: IButtonProps) {
    const style =
        height
            ? { '--height': `${height}px` }
            : undefined;

    if (type === undefined) {
        type = 'button';
    }

    return (
        <button
            className={cn(
                className,
                'sonm-button',
                {
                    [`sonm-button--color-${color}`]: Boolean(color),
                    'sonm-button--square-pants': square,
                    'sonm-button--transparent': transparent,
                },
            )}
            style={style}
            type={type}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
