import * as React from 'react';
import { IdentIcon } from '../ident-icon';
import * as cn from 'classnames';
import { Icon } from '../icon';
import { Balance } from '../balance-view';
import { Hash } from '../hash-view';
import { DownloadFile } from '../download-file';
import { ICurrencyInfo } from 'common/types/currency';

export interface IAccountItemProps {
    className?: string;
    address: string;
    json?: string;
    name: string;
    etherBalance?: string;
    primaryTokenBalance?: string;
    onRename?: (newName: string, address: string) => void;
    onClickIcon?: (address: string) => void;
    onClickShowPrivateKey?: (address: string) => void;
    onClickProfileIcon?: (address: string) => void;
    hasButtons?: boolean;
    primaryTokenInfo?: ICurrencyInfo;
}

export class AccountItem extends React.Component<IAccountItemProps, any> {
    public state = {
        isEdit: false,
    };

    protected inputRef?: any;

    protected handleClickIcon = (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();

        if (this.props.onClickIcon) {
            this.props.onClickIcon(this.props.address);
        }
    };

    protected handleShowPrivateKey = (event: any) => {
        event.preventDefault();

        if (this.props.onClickShowPrivateKey) {
            this.props.onClickShowPrivateKey(this.props.address);
        }
    };

    protected handleClickProfileIcon = (event: any) => {
        event.preventDefault();

        if (this.props.onClickProfileIcon) {
            this.props.onClickProfileIcon(this.props.address);
        }
    };

    public render() {
        const {
            className,
            address,
            etherBalance,
            primaryTokenBalance,
            primaryTokenInfo,
            onClickIcon,
            json,
            hasButtons,
        } = this.props;

        return (
            <div className={cn('sonm-account-item', className)}>
                <IdentIcon
                    address={address}
                    className="sonm-account-item__blockies"
                />
                {onClickIcon ? (
                    <a
                        href="#"
                        onClick={this.handleClickIcon}
                        className="sonm-account-item__icon-link"
                    />
                ) : null}
                <span className="sonm-account-item__name-wrapper">
                    {this.renderName()}
                </span>
                {etherBalance !== undefined ? (
                    <Balance
                        className="sonm-account-item__sonm"
                        balance={etherBalance}
                        symbol="Ether"
                        decimalPointOffset={18}
                    />
                ) : null}
                <Hash
                    hasCopyButton={hasButtons}
                    className="sonm-account-item__address"
                    hash={address}
                    onClick={this.handleClickIcon}
                />
                {primaryTokenBalance !== undefined && primaryTokenInfo ? (
                    <Balance
                        className="sonm-account-item__ether"
                        balance={primaryTokenBalance}
                        symbol={primaryTokenInfo.symbol}
                        decimalPointOffset={primaryTokenInfo.decimalPointOffset}
                    />
                ) : null}
                {hasButtons && json ? (
                    <div className="sonm-account-item__buttons">
                        <DownloadFile
                            data={json}
                            fileName={`account-${address}.json`}
                        >
                            <Icon
                                i="Download"
                                className="sonm-account-item__action"
                            />
                        </DownloadFile>
                        {this.props.onClickShowPrivateKey ? (
                            <a
                                href="/show-private-key"
                                onClick={this.handleShowPrivateKey}
                            >
                                <Icon
                                    i="Eye"
                                    className="sonm-account-item__action"
                                />
                            </a>
                        ) : null}
                        <a
                            href="/show-profile"
                            onClick={this.handleClickProfileIcon}
                        >
                            <Icon
                                i="Profile"
                                className="sonm-account-item__action"
                            />
                        </a>
                    </div>
                ) : null}
            </div>
        );
    }

    private focusOnInput = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    };

    private startEdit = () => {
        this.setState(
            {
                isEdit: true,
            },
            this.focusOnInput,
        );
    };

    private handleKeyUp = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.stopEdit();
        }
    };

    private stopEdit = () => {
        if (this.props.onRename) {
            const text = this.inputRef.value;
            if (text) {
                this.props.onRename(this.props.address, text);
            }
        }

        this.setState({
            isEdit: false,
        });
    };

    private cancelEdit = () => {
        this.setState({
            isEdit: false,
        });
    };

    private saveRef = (ref: any) => {
        this.inputRef = ref;
    };

    public renderName() {
        const { name, onRename } = this.props;

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
                    <Icon
                        tag="button"
                        key="b"
                        i="Pencil"
                        onClick={this.startEdit}
                        className="sonm-account-item__edit-button"
                    />,
                );
            }
        }

        return result;
    }
}

export default AccountItem;
