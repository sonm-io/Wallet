import * as React from 'react';
import * as cn from 'classnames';

export type TButtonColor = 'blue' | 'pink' | 'gray' | 'violet';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    color?: TButtonColor;
    transparent?: boolean;
    square?: boolean;
    children?: any;
    height?: number;
    type?: string;
}

export class Button extends React.PureComponent<IButtonProps> {
    protected buttonNode?: HTMLButtonElement;

    protected saveRef = (ref: HTMLButtonElement | null) => ref && (this.buttonNode = ref);

    public focus = () => {
        this.buttonNode && this.buttonNode.focus();
    }

    public render() {
        const {
            color = 'blue',
            square,
            transparent,
            children,
            height,
            type,
            className,
            ...rest,
        } = this.props;

        const style =
            height
                ? {'--height': `${height}px`}
                : undefined;

        return (
            <button
                ref={this.saveRef}
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
                type={type === undefined ? 'button' : type}
                {...rest}
            >
                {children}
            </button>
        );
    }
}

export default Button;
