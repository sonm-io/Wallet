import { Button } from '../button';
import { Dialog } from '../dialog';
import * as React from 'react';

import { DeletableItem, IDeletableItemProps } from './index';

export interface IDeletableItemWithConfirmationProps<T> extends IDeletableItemProps {
    Confirmation: React.ComponentClass<T> | React.SFC<T>;
    item: T;
}

export class DeletableItemWithConfirmation<T> extends React.PureComponent<IDeletableItemWithConfirmationProps<T>, any> {
    public state = {
        isConfirmationVisible: false,
    }

    public static defaultProps: Partial<IDeletableItemWithConfirmationProps<any>> = {
        Confirmation: (item: any) => {
            return <span>Are you sure?</span>;
        },
    }

    protected handleDelete = () => {
        this.setState({ isConfirmationVisible: true });
    }

    protected handleConfirm = () => {
        this.props.onDelete(this.props.id);
        this.setState({ isConfirmationVisible: false });
    }

    protected handleCancel= () => {
        this.setState({ isConfirmationVisible: false });
    }

    public render() {
        const {
            onDelete,
            Confirmation,
            children,
            item,
            ...rest,
        } = this.props;

        return (
            <DeletableItem {...rest} onDelete={this.handleDelete}>
                {children}
                {
                    this.state.isConfirmationVisible
                        ? (
                            <Dialog
                                onClickCross={this.handleCancel}
                                className="sonm-deletable-item__confirmation-dialog"
                            >
                                <Confirmation {...item} />
                                <div className="sonm-deletable-item__confirmation-button-group">
                                    <Button className="sonm-deletable-item__confirmation-button" transparent onClick={this.handleCancel}>Cancel</Button>
                                    <Button className="sonm-deletable-item__confirmation-button" onClick={this.handleConfirm}>Delete</Button>
                                </div>
                            </Dialog>
                        )
                        : null
                }
            </DeletableItem>
        );
    }

}

export default DeletableItemWithConfirmation;
