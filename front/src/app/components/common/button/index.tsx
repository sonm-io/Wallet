import * as React from 'react';
import * as cn from 'classnames';

export type TButtonColor = 'blue' | 'pink' | 'gray' | 'violet' | 'green';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    color?: TButtonColor;
    transparent?: boolean;
    square?: boolean;
    children?: any;
    height?: number;
    type?: string;
    tag?: string;
    autoFocus?: boolean;
}

export class Button extends React.PureComponent<IButtonProps> {
    protected buttonNode?: HTMLButtonElement;

    protected saveRef = (ref: HTMLButtonElement | null) => {
        if (ref !== null) {
            if (
                this.props.autoFocus &&
                this.buttonNode === undefined &&
                ref.focus
            ) {
                ref.focus();
            }

            this.buttonNode = ref;
        }
    };

    public focus = () => {
        this.buttonNode && this.buttonNode.focus && this.buttonNode.focus();
    };

    public render() {
        const {
            color,
            square,
            transparent,
            children,
            height,
            type,
            className,
            ...rest
        } = this.props;

        const style = height
            ? { '--height': `${height}px`, ...rest.style }
            : rest.style;

        const Tag = this.props.tag || 'button';

        return (
            <Tag
                {...rest}
                ref={this.saveRef}
                className={cn(className, 'sonm-button', {
                    [`sonm-button--color-${color}`]: Boolean(color),
                    'sonm-button--square-pants': square,
                    'sonm-button--transparent': transparent,
                })}
                style={style}
                type={type === undefined ? 'button' : type}
            >
                {children}
            </Tag>
        );
    }
}

export default Button;
