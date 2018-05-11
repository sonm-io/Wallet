import * as React from 'react';
import * as cn from 'classnames';

const icons: any = {
    Exit: require('./exit.svg').default,
    Export: require('./export.svg').default,
    Import: require('./import.svg').default,
    Eye: require('./eye.svg').default,
    Pencil: require('./pencil.svg').default,
    Default: require('./default.svg').default,
    Copy: require('./copy.svg').default,
    Download: require('./download.svg').default,
    Info: require('./info.svg').default,
    Close: require('./close.svg').default,
    ArrowRight: require('./arrow-right.svg').default,
    Refresh: require('./refresh.svg').default,
    Sync: require('./sync.svg').default,
    OrderAsc: require('./order-asc.svg').default,
    OrderDesc: require('./order-desc.svg').default,
};

interface IAny {
    [key: string]: any;
}

interface IIconProps extends IAny {
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
