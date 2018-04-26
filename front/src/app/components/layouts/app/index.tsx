import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores';
import { LoadMask } from 'app/components/common/load-mask';
import { AlertList } from './sub/alerts';
import { AppHeader } from './sub/app-header';
import { Header } from 'app/components/common/header';

interface IProps {
    className?: string;
    children: any;
    error: string;
    selectedNavMenuItem: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
}

@observer
export class App extends React.Component<IProps, any> {
    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    public render() {
        const { className, selectedNavMenuItem, children } = this.props;
        const t = rootStore.localizator.getMessageText;

        return (
            <div className={cn('sonm-app', className)}>
                <LoadMask white visible={rootStore.isPending}>
                    <AppHeader
                        className="sonm-app__header"
                        path={selectedNavMenuItem}
                        isTestNet={true}
                        gethNodeUrl="infura.com"
                        sonmNodeUrl="dwh.sonm.com"
                        onNavigate={() => null}
                        onExit={() => null}
                    />
                    <div className="sonm-app__alert-group">
                        {rootStore.isOffline ? (
                            <Alert type="error" id="no-connect">
                                {t('sonmapi_network_error')}
                            </Alert>
                        ) : null}
                        <AlertList
                            className="sonm-app__alert-list"
                            rootStore={rootStore}
                        />
                    </div>
                    <div className="sonm-app__common sonm-app-common-block">
                        <Header className="sonm-app-common-block__title" />
                    </div>
                    <div className="sonm-app__content">
                        <div className="sonm-app__content-scroll-ct">
                            {children}
                        </div>
                    </div>
                </LoadMask>
            </div>
        );
    }
}
