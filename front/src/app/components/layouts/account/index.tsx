import * as React from 'react';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../../stores/main';
import { AccountBigSelect } from 'app/components/common/account-big-select';

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

@inject('mainStore')
@observer
export class Account extends React.Component<IProps, any> {
    public render() {
        if (this.props.mainStore === undefined) {
            return null;
        }

        const {
            className,
        } = this.props;

        return (
                <div className={cn('sonm-history', className)}>
                    <AccountBigSelect
                        className="sonm-history__select-account"
                        returnPrimitive
                        accounts={this.props.mainStore.accountList}
                        hasEmptyOption
                    />
                </div>
        );
    }
}

export default Account;
