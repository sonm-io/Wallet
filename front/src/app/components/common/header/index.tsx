import * as React from 'react';
import * as cn from 'classnames';

export interface IHeaderProps extends React.ButtonHTMLAttributes<any> {
    children?: any;
    className?: string;
}

export function Button({ children, className }: IHeaderProps) {
    return (
        <h1 className={cn('sonm-header', className)}>
            {children}
        </h1>
    );
}

export default Button;
