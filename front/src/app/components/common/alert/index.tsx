import * as React from 'react';
import * as cn from 'classnames';

export enum AlertType {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info',
}

export interface IAlert {
    type: AlertType;
    message: string;
}

export interface IAlertProps extends IAlert {
    id: string;
    className?: string;
    onClosed: (id: string) => void;
    hideDelay?: number;
}

export class Alert extends React.PureComponent<IAlertProps, any> {
    public componentDidMount() {
        if (this.props.hideDelay) {
            setTimeout(() => this.setState({ closed: true }), this.props.onClosed);
        }
    }

    private handleClickCross = (event: any) => {
        this.props.onClosed && this.props.onClosed(this.props.id);
    }

    public render() {
        const {
            className,
            type,
            message,
            hideDelay = 0,
        } = this.props;

        return (
            <div
                className={cn(
                    className,
                    'sonm-alert',
                    `sonm-alert--${type}`)}
                style={{ '--hide-delay': hideDelay }}
            >
                <span className="sonm-alert__message">{message}</span>
                <button type="button" className="sonm-alert__cross" onClick={this.handleClickCross}> + </button>
            </div>
        );
    }
}

export default Alert;
