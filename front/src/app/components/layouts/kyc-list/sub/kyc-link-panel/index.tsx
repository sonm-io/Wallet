import * as React from 'react';
import { IconButton } from 'app/components/common/icon';
import { copyToClipboard } from '../../../../../utils/clipboard-helper';
import * as cn from 'classnames';

export interface IKycLinkPanelProps {
    className?: string;
    value: string;
    onClose: () => void;
}

export class KycLinkPanel extends React.Component<IKycLinkPanelProps, never> {
    protected handleClickCopy = () => {
        copyToClipboard(this.props.value);
    };

    protected handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        this.props.onClose();
    };

    public render() {
        return (
            <div className={cn('kyc-link-panel', this.props.className)}>
                <IconButton
                    className="kyc-link-panel__close-button"
                    i="Close"
                    onClick={this.handleClose}
                />
                <h4 className="kyc-link-panel__header">
                    Excellent. Here's your link!
                </h4>

                <div className="kyc-link-panel__message">
                    Please click on the link and fill in all the required
                    fields. Than you can close this tab.
                </div>

                <button
                    className="kyc-link-panel__show-button"
                    type="button"
                    onClick={this.handleClickCopy}
                >
                    COPY LINK
                </button>
                <div className="kyc-link-panel__input-wrapper">
                    <input
                        className="kyc-link-panel__input"
                        value={this.props.value}
                    />
                </div>
            </div>
        );
    }
}
