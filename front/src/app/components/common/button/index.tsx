import * as React from 'react';
import * as cn from 'classnames';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    color: string;
    isTransparent: boolean;
    isSquare: boolean;
    children: any;
    height?: number;
}

export function Button({ color = 'blue', isSquare, isTransparent, children, height, ...rest }: IButtonProps) {
    const style =
        height
            ? { '--height': `${height}px` }
            : undefined;

    return (
        <button
            className={cn(
                'sonm-button',
                `sonm-button--color-${color}`,
                {
                    'sonm-button--square-pants': isSquare,
                    'sonm-button--transparent': isTransparent,
                },
            )}
            style={style}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
