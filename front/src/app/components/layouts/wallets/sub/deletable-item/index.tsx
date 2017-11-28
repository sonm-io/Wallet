import * as React from 'react';
import * as cn from 'classnames';

export interface IDeletableItemProps {
    className?: string;
    children?: any;
    onClose: (id: string) => void;
    id: string;
}

export class DeletableItem extends React.PureComponent<IDeletableItemProps, any> {
    private handleClose() {
        this.props.onClose(this.props.id);
    }

    public render() {
        const {
            className,
            children,
        } = this.props;

        return (
            <div className={cn('sonm-deletable-item', className)}>
                <div className="sonm-deletable-item__children">
                    {children}
                </div>
                <button
                    onClick={this.handleClose}
                    className="sonm-deletable-item__close"
                />
            </div>
        );
    }

}

export default DeletableItem;
