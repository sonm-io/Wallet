import * as React from 'react';
import { Alert } from 'antd';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

@inject('mainStore')
@observer
export class AlertList extends React.Component<IProps, any> {
    public handleClose = (message: string) => {
        if (!this.props.mainStore) { return; }

        this.props.mainStore.closeAlert(message);
    }

    public render() {
        if (!this.props.mainStore) { return null; }

        return <div className="sonm-alert-list__ct">
            <div className="sonm-alert-list">
                {Array.from(this.props.mainStore.alerts.entries()).map(([id, alert]) => <Alert
                    closable
                    message={alert.message}
                    description={alert.description}
                    type={alert.type}
                    className="sonm-alert-list__item"
                    key={id}
                    onClose={this.handleClose.bind(this, id)}
                />)}
            </div>
        </div>;
    }
}

export default AlertList;
