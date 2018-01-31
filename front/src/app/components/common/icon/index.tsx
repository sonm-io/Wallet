import * as React from 'react';
import * as cn from 'classnames';

interface IIconProps {
    className?: string;
    i: string;
}

export class Icon extends React.PureComponent<IIconProps, any> {
    public render() {
        const { className, i } = this.props;

        return (
            <div
                className={cn(
                    'sonm-icon',
                    className,
                    `sonm-icon--${i}`,
                )}
            />
        );
    }
}

export default Icon;
