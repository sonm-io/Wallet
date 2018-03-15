import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as cn from 'classnames';
import { Icon } from '../icon';

export type TColor = 'light' | 'dark';

export interface IDialogProps extends React.ButtonHTMLAttributes<any> {
    color?: TColor;
    className?: string;
    children?: any;
    height?: number;
    onClickCross?: () => void;
}

export class Dialog extends React.PureComponent<IDialogProps> {
    protected handleClickCross = () => {
        this.props.onClickCross && this.props.onClickCross();
    };

    public render() {
        const { color = 'light', children, height, className } = this.props;

        const style = height ? { height: `${height}px` } : undefined;

        return ReactDOM.createPortal(
            <div
                className={cn('sonm-popup', {
                    'sonm-popup--dark': color === 'dark',
                })}
            >
                <div className="sonm-popup__pale" />
                <div className="sonm-popup__outer">
                    <div
                        tabIndex={0}
                        role="dialog"
                        className={cn('sonm-popup__inner', className)}
                        style={style}
                    >
                        {this.props.onClickCross ? (
                            <Icon
                                i="Close"
                                tag="button"
                                type="button"
                                className="sonm-popup__cross"
                                onClick={this.handleClickCross}
                            />
                        ) : null}
                        {children}
                    </div>
                </div>
            </div>,
            window.document.body,
        );
    }
}

export default Dialog;
