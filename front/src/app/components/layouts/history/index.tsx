import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';

interface IProps {
  className?: string;
}

@inject('Store')
@observer
export class History extends React.Component<IProps, any> {

  public render() {
    const {
      className,
    } = this.props;

    return (
      <div className={cn('sonm-send', className)}>
        history
      </div>
    );
  }
}
