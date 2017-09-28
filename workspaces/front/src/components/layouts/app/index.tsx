import * as React from 'react';
import { Tabs } from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { navigate } from 'router';
import * as api from 'api';

interface IProps {
  className?: string;
  route: string;
  children: any;
  user: {
    balance: string;
    tokenBalance: string;
  };
}

@inject('user')
@observer
export class App extends React.Component<IProps, any> {
  public componentWillMount() {
    this.checkAuth();
  }

  private async checkAuth() {
    if (!api.methods.checkAuth()) {
      navigate({ path: '/login' });
    }
  }

  public render() {
    const {
      className,
      route,
      children,
      user: {
        balance,
        tokenBalance,
      },
    } = this.props;

    return (
      <div className={cn('sonm-app', className)}>
        <h2 className="sonm-app__eth-balance">
          Eth balance {balance}
        </h2>
        <h2 className="sonm-app__sonm-balance">
          SONM balance {tokenBalance}
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
