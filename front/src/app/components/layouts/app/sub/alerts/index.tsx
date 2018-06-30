import * as React from 'react';
import { Alert } from 'app/components/common/alert';
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
                            {alert.message}
                        </Alert>
                    ))}
                </div>
            </div>
        );
    }
}

export default AlertList;
