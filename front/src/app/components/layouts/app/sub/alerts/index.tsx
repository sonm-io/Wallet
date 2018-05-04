import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import { Hash } from 'app/components/common/hash-view';
import { IAlert } from 'app/stores/types';

interface IProps {
    className?: string;
    alerts: IAlert[];
    onCloseAlert: (id: string) => void; // rootStore.uiStore.closeAlert(id);
}

export class AlertList extends React.Component<IProps, never> {
    public handleCloseAlert = (id: string) => {
        this.props.onCloseAlert(id);
    };

    protected getText(alert: IAlert): any[] {
        let idx = 0;
        const msg = alert.message;
        const result: any[] = [];

        msg.replace(/0x[0-9a-zA-Z]+/gi, function(value, position) {
            result.push(msg.slice(idx, position));
            result.push(
                <Hash
                    hash={value}
                    hasCopyButton
                    className="sonm-alert-list__hash"
                />,
            );
            idx = position + value.length;

            return '';
        });
        result.push(msg.slice(idx, msg.length));

        return result;
    }

    public render() {
        return (
            <div className="sonm-alert-list__ct">
                <div className="sonm-alert-list">
                    {this.props.alerts.map(alert => (
                        <Alert
                            type={alert.type}
                            className="sonm-alert-list__item"
                            key={alert.id}
                            id={alert.id}
                            onClosed={this.handleCloseAlert}
                        >
                            {this.getText(alert)}
                        </Alert>
                    ))}
                </div>
            </div>
        );
    }
}

export default AlertList;
