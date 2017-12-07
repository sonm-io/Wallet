import * as React from 'react';
import { IdentIcon } from '../ident-icon';
import * as cn from 'classnames';
import { Icon } from 'antd';

export interface IAccountItemProps {
    className?: string;
    address: string;
    name: string;
    firstBalance: string;
    secondBalance: string;
    onRename?: (newName: string, address: string) => void;
    onClick?: (address: string) => void;
}

export class AccountItem extends React.Component<IAccountItemProps, any> {
    public state  = {
        isEdit: false,
    };

    private inputRef?: any;

    public render() {
        const {
            className,
            address,
            firstBalance,
            secondBalance,
        } = this.props;

        return (
            <div className={cn('sonm-account-item', className)}>
                <IdentIcon address={address} className="sonm-account-item__blockies"/>
                <span className="sonm-account-item__name-wrapper">
                    <span className="sonm-account-item__name-inner">
                        {this.renderName()}
                    </span>
                </span>
                <span className="sonm-account-item__ether">{firstBalance}</span>
                <span className="sonm-account-item__address">{address}</span>
                <span className="sonm-account-item__sonm">{secondBalance}</span>
            </div>
        );
    }

    private focusOnInput = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    }

    private startEdit = () => {
        this.setState({
            isEdit: true,
        }, this.focusOnInput);
    }

    private handleKeyUp = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.stopEdit();
        }
    }

    private stopEdit = () => {
        if (this.props.onRename) {
            const text = this.inputRef.value;
            this.props.onRename(this.props.address, text);
        }

        this.setState({
            isEdit: false,
        });
    }

    private cancelEdit = () => {
        this.setState({
            isEdit: false,
        });
    }

    private saveRef = (ref: any) => {
        this.inputRef = ref;
    }

    public renderName() {
        const {
            name,
            onRename,
        } = this.props;

        const result = [];

        if (this.state.isEdit) {
            result.push(
                <input
                    required
                    spellCheck={false}
                    defaultValue={this.props.name}
                    ref={this.saveRef}
                    onBlur={this.cancelEdit}
                    key="i"
                    type="text"
                    className="sonm-account-item__edit-name"
                    onKeyUp={this.handleKeyUp}
                />,
            );
        } else {
            result.push(
                <span className="sonm-account-item__name-text" key="s">
                    {name}
                </span>,
            );

            if (onRename) {
                result.push(
                    <button key="b" className="sonm-account-item__edit-icon" onClick={this.startEdit}>
                        <Icon type="edit" />
                    </button>,
                );
            }
        }

        return result;
    }
}

export default AccountItem;
