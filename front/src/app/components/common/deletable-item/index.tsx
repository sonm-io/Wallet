import * as React from 'react';
import * as cn from 'classnames';

export interface IDeletableItemProps {
    className?: string;
    children?: any;
    onDelete: (id: string) => void;
    id: string;
}

export class DeletableItem extends React.PureComponent<IDeletableItemProps, any> {
    private handleDelete = () => {
        this.props.onDelete(this.props.id);
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
                    type="button"
                    onClick={this.handleDelete}
                    className="sonm-deletable-item__close"
                />
            </div>
        );
    }

}

export default DeletableItem;
