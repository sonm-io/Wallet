import * as React from 'react';
import { Tabs, Alert } from 'antd';
import { default as cn } from 'classnames';
import { inject, observer } from 'mobx-react';
import { navigate } from 'src/app/router';

interface IProps {
  className?: string;
  route: string;
  children: any;
  userStore: {
    ethBalance: string;
    snmBalance: string;
    isAuth: boolean;
    error: string;
    fetch: () => void;
  };
}

@inject('userStore')
@observer
export class App extends React.Component<IProps, any> {
  public componentWillMount() {
    if (!this.props.userStore.isAuth) {
      navigate({ path: '/login' });
    } else {
      this.props.userStore.fetch();
    }
  }

  public render() {
    const {
      className,
      route,
      children,
      userStore: {
        ethBalance,
        snmBalance,
        error,
      },
    } = this.props;

    return (
      <div className={cn('sonm-app', className)}>
        {error ? <Alert message={error} /> : null}
        <h2 className="sonm-app__eth-balance">
          ETH: {ethBalance}
        </h2>
        <h2 className="sonm-app__sonm-balance">
          SONM: {snmBalance}
        </h2>
        <Tabs defaultActiveKey={route} className="sonm-app__tabs">
          <Tabs.TabPane tab="Main" key="Main" />
          <Tabs.TabPane tab="Something" key="Something" />
        </Tabs>
        <div className="sonm_app__content">
          {children}
        </div>
      </div>
    );
  }
}
