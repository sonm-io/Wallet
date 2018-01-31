import { Button } from '../button';
import { Dialog } from '../dialog';
import * as React from 'react';

import { DeletableItem, IDeletableItemProps } from './index';
import { FormButtons } from '../form/form';

export interface IDeletableItemWithConfirmationProps<TItemProps> extends IDeletableItemProps {
    Confirmation: React.ComponentClass<TItemProps> | React.SFC<TItemProps>;
    item: TItemProps;
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

    protected handleCancel = () => {
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
                                <FormButtons>
                                    <Button
                                        className="sonm-deletable-item__confirmation-button"
                                        transparent
                                        onClick={this.handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="sonm-deletable-item__confirmation-button"
                                        onClick={this.handleConfirm}
                                    >
                                        Delete
                                    </Button>
                                </FormButtons>
                            </Dialog>
                        )
                        : null
                }
            </DeletableItem>
        );
    }

}

export default DeletableItemWithConfirmation;
