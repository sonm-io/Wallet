import * as React from 'react';
import * as cn from 'classnames';

interface IPositionCssClasses {
    right: string;
    left: string;
    top: string;
    bottom: string;
}

interface ICssClasses extends IPositionCssClasses {
    root: string;
}

interface IBaloonProps {
    className?: string;
    cssClasses?: ICssClasses;
    position: keyof IPositionCssClasses;
}

export class Balloon extends React.PureComponent<IBaloonProps, never> {
    public static defaultCssProps: ICssClasses = {
        root: 'sonm-balloon',
        right: 'sonm-balloon--right',
        left: 'sonm-balloon--left',
        top: 'sonm-balloon--top',
        bottom: 'sonm-balloon--bottom',
    };

    public static defaultProps = {
        cssClasses: Balloon.defaultCssProps,
        visible: true,
        position: 'bottom',
    };

    public render() {
        const {
            className,
            cssClasses = Balloon.defaultCssProps,
            children,
            position,
        } = this.props;

        return (
            <div
                className={cn(className, cssClasses.root, cssClasses[position])}
            >
                {children}
            </div>
        );
    }
}

export default Balloon;
