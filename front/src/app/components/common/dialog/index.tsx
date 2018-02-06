import * as React from 'react';
import * as cn from 'classnames';

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
    }

    public render() {
        const {
            color = 'light',
            children,
            height,
            className,
        } = this.props;

        const style = height
            ? { height: `${height}px` }
            : undefined;

        return (
            <div className={cn('sonm-popup', { 'sonm-popup--dark': color === 'dark'})}>
                <div
                    className="sonm-popup__pale"
                    key="popup-pale"
                />
                <div className="sonm-popup__outer" key="popup-content">
                    <div className={cn('sonm-popup__inner', className)} style={style}>
                        {this.props.onClickCross
                            ? <button
                                type="button"
                                className="sonm-popup__cross"
                                onClick={this.handleClickCross}> + </button>
                            : null}
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Dialog;
