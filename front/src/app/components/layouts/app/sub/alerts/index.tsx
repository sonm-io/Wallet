import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import { Hash } from 'app/components/common/hash-view';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import { IAlert } from 'app/stores/types';

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

    protected getText(alert: IAlert): any[] {
        let idx = 0;
        const msg = alert.message;
        const result: any[] = [];

        msg.replace(/0x[0-9a-zA-Z]+/gi, function(value, position) {
            result.push(msg.slice(idx, position));
            result.push(<Hash hash={value} hasCopyButton className="sonm-alert-list__hash"/>);
            idx = position + value.length;

            return '';
        });
        result.push(msg.slice(idx, msg.length - 1));

        return result;
    }

    public render() {
        if (!this.props.mainStore) { return null; }

        return <div className="sonm-alert-list__ct">
            <div className="sonm-alert-list">
                {Array.from(this.props.mainStore.alerts.entries()).map(([id, alert]) => <Alert
                    type={alert.type}
                    className="sonm-alert-list__item"
                    key={id}
                    id={id}
                    onClosed={this.handleClosed}
                >
                    {this.getText(alert)}
                </Alert>)}
            </div>
        </div>;
    }
}

export default AlertList;
