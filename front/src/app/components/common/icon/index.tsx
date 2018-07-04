import * as React from 'react';
import * as cn from 'classnames';

// To get more icons go to: https://material.io/icons/
export const icons: any = {
    ArrowBack: require('./arrow-back.svg').default,
    ArrowDown: require('./arrow-down.svg').default,
    ArrowRight: require('./arrow-right.svg').default,
    ArrowUp: require('./arrow-up.svg').default,
    Close: require('./close.svg').default,
    Copy: require('./copy.svg').default,
    Default: require('./default.svg').default,
    Download: require('./download.svg').default,
    Exit: require('./exit.svg').default,
    Export: require('./export.svg').default,
    Eye: require('./eye.svg').default,
    EyeOff: require('./eye-off.svg').default,
    Import: require('./import.svg').default,
    Info: require('./info.svg').default,
    OrderAsc: require('./order-asc.svg').default,
    OrderDesc: require('./order-desc.svg').default,
    Pencil: require('./pencil.svg').default,
    Refresh: require('./refresh.svg').default,
    Sync: require('./sync.svg').default,
};

interface IAny {
    [key: string]: any;
}

export interface IIconProps extends IAny {
    color?: string;
    className?: string;
    tag?: string;
    i: string;
}

export class Icon extends React.PureComponent<IIconProps, any> {
    public render() {
        const { className, i, color, tag, ...rest } = this.props;

        const Svg = icons[i] || icons.Default;

        const Tag = tag ? tag : 'div';

        return (
            <Tag
                {...rest}
                className={cn('sonm-icon', className)}
                style={color ? { color } : undefined}
            >
                <Svg />
            </Tag>
        );
    }
}

export default Icon;
