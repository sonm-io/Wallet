import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

@inject('mainStore')
@observer
export class AlertList extends React.Component<IProps, any> {
    public handleClosed = (id: string) => {
        if (!this.props.mainStore) { return; }

        this.props.mainStore.closeAlert(id);
    }

    public render() {
        if (!this.props.mainStore) { return null; }

        return <div className="sonm-alert-list__ct">
            <div className="sonm-alert-list">
                {Array.from(this.props.mainStore.alerts.entries()).map(([id, alert]) => <Alert
                    message={alert.message}
                    type={alert.type}
                    className="sonm-alert-list__item"
                    key={id}
                    id={id}
                    onClosed={this.handleClosed}
                />)}
            </div>
        </div>;
    }
}

export default AlertList;
