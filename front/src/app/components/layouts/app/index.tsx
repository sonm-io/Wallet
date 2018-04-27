import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores';
import { LoadMask } from 'app/components/common/load-mask';
import { AlertList } from './sub/alerts';
import { AppHeader } from './sub/app-header';
import { Header } from 'app/components/common/header';
import { BreadCrumbs } from 'app/components/common/breadcrumbs';

interface IProps {
    className?: string;
    children: any;
    error: string;
    path: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
    title?: string;
    breadcrumb: any;
}

@observer
export class App extends React.Component<IProps, any> {
    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    public render() {
        const p = this.props;
        const { className, path, children } = this.props;
        const t = rootStore.localizator.getMessageText;

        return (
            <div className={cn('sonm-app', className)}>
                <LoadMask white visible={rootStore.isPending}>
                    <AppHeader
                        className="sonm-app__header"
                        path={path}
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
                        <BreadCrumbs
                            className="sonm-app__breadcrumbs"
                            items={[['Tam', '/path']]}
                            onNavigate={p.onNavigate}
                        />
                        <Header className="sonm-app-common-block__title">
                            {p.title}
                        </Header>
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
