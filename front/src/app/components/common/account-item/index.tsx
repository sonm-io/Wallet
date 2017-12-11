import * as React from 'react';
import { IdentIcon } from '../ident-icon';
import * as cn from 'classnames';
import { Icon } from 'antd';
import { Balance } from '../balance-view';

export interface IAccountItemProps {
    className?: string;
    address: string;
    name: string;
    firstBalance: string;
    secondBalance: string;
    onRename?: (newName: string, address: string) => void;
    onClickIcon?: (address: string) => void;
}

export class AccountItem extends React.Component<IAccountItemProps, any> {
    public state  = {
        isEdit: false,
    };

    protected inputRef?: any;

    protected handleClickIcon = (event: any) => {
        event.preventDefault();

        this.props.onClickIcon && this.props.onClickIcon(this.props.address);
    }

    public render() {
        const {
            className,
            address,
            firstBalance,
            secondBalance,
            onClickIcon,
        } = this.props;

        return (
            <div className={cn('sonm-account-item', className)}>
                <IdentIcon address={address} className="sonm-account-item__blockies"/>
                {onClickIcon
                    ? <a href="" onClick={this.handleClickIcon} className="sonm-account-item__icon-link"/>
                    : null
                }
                <span className="sonm-account-item__name-wrapper">
                    {this.renderName()}
                </span>
                <Balance
                    className="sonm-account-item__sonm"
                    fullString={firstBalance}
                    fontSizePx={16}
                />
                <span className="sonm-account-item__address">{address}</span>
                {onClickIcon
                    ? <a href="" onClick={this.handleClickIcon} className="sonm-account-item__address-link"/>
                    : null
                }
                <Balance
                    className="sonm-account-item__ether"
                    fullString={secondBalance}
                    fontSizePx={16}
                />
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
