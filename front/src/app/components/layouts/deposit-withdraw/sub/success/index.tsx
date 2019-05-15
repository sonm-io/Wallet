import * as React from 'react';
import * as cn from 'classnames';
import { Header } from 'app/components/common/header';
import {
    withRootStore,
    Layout,
    IHasRootStore,
} from 'app/components/layouts/layout';

interface IProps extends IHasRootStore {
    className?: string;
    onClickHistory: () => void;
    onClickDeposit: () => void;
    onClickWithdraw: () => void;
}

class DepositWithdrawSuccessLayout extends Layout<IProps> {
    protected handleClickHistory = this.props
        ? this.props.onClickHistory.bind(undefined, 'all', 'all')
        : null;

    public render() {
        return [
            <Header className="sonm-send-success__header" key="header">
                Transaction has been sent. What we will do next?
            </Header>,
            <div
                className={cn('sonm-send-success', this.props.className)}
                key="success"
            >
                <button
                    onClick={this.props.onClickDeposit}
                    className="sonm-send-success__button"
                    tabIndex={0}
                >
                    <div className="sonm-send-success__icon-deposit" />
                    <div className="sonm-send-success__label">
                        Make a new deposit
                    </div>
                </button>
                <button
                    onClick={this.handleClickHistory}
                    className="sonm-send-success__button"
                >
                    <div className="sonm-send-success__icon-history" />
                    <div className="sonm-send-success__label">
                        View deposit & withdraw history
                    </div>
                </button>
                <button
                    onClick={this.props.onClickWithdraw}
                    className="sonm-send-success__button"
                    tabIndex={0}
                >
                    <div className="sonm-send-success__icon-withdraw" />
                    <div className="sonm-send-success__label">
                        Make a new withdraw
                    </div>
                </button>
            </div>,
        ];
    }
}

export const DepositWithdrawSuccess = withRootStore(
    DepositWithdrawSuccessLayout,
);

export default DepositWithdrawSuccess;
