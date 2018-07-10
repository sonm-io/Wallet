import * as React from 'react';
import * as cn from 'classnames';
import { Icon } from '../icon';
import { Hash } from '../hash-view';

export interface IAlertProps {
    id: string;
    className?: string;
    onClosed?: (id: string) => void;
    hideDelay?: number;
    children: any;
    type: string;
}

export class Alert extends React.PureComponent<IAlertProps, any> {
    public componentDidMount() {
        if (this.props.hideDelay) {
            setTimeout(
                () => this.setState({ closed: true }),
                this.props.onClosed,
            );
        }
    }

    private handleClickCross = (event: any) => {
        if (this.props.onClosed) {
            this.props.onClosed(this.props.id);
        }
    };

    protected static processMessage(msg: string): any[] {
        let idx = 0;
        const result: any[] = [];

        msg.replace(/0x[0-9a-zA-Z]+/gi, function(value, position) {
            result.push(msg.slice(idx, position));
            result.push(
                <Hash
                    key={value}
                    hash={value}
                    hasCopyButton
                    className="sonm-alert__hash"
                />,
            );
            idx = position + value.length;

            return '';
        });

        msg.replace(/\[b\].+?\[\/b\]/gi, function(value, position) {
            result.push(msg.slice(idx, position));
            result.push(
                <span className="sonm-alert__bold">
                    {value.replace('[b]', '').replace('[/b]', '')}
                </span>,
            );
            idx = position + value.length;

            return '';
        });
        result.push(msg.slice(idx, msg.length));

        return result;
    }

    public render() {
        const {
            className,
            type,
            children,
            onClosed,
            hideDelay = 0,
        } = this.props;

        const style: any = { '--hide-delay': hideDelay };

        return (
            <div
                className={cn(className, 'sonm-alert', `sonm-alert--${type}`)}
                style={style}
            >
                <span className="sonm-alert__message">
                    {typeof children === 'string'
                        ? Alert.processMessage(children)
                        : children}
                </span>
                {onClosed ? (
                    <Icon
                        i="Close"
                        type="button"
                        className="sonm-alert__cross"
                        onClick={this.handleClickCross}
                    />
                ) : null}
            </div>
        );
    }
}

export default Alert;
