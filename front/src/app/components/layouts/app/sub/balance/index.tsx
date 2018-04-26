import * as React from 'react';
import * as cn from 'classnames';
import { Balance } from 'app/components/common/balance-view';

interface IAppBalanceProps {
    marketMode: boolean;
    etherBalance: string;
    snmBalance: string;
    usdBalance: string;
    ratePerDay: string;
    daysLeft: string;
    className?: string;
}

export class AppBalance extends React.PureComponent<IAppBalanceProps, any> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('app-balance', p.className)}>
                {p.marketMode ? (
                    <React.Fragment>
                        <div className="app-balance__row">
                            <span className="app-balance__label">
                                On Ethereum:
                            </span>
                            <Balance
                                className="app-balance__value"
                                balance={p.etherBalance}
                                decimalPointOffset={18}
                                symbol="ETH"
                                decimalDigitAmount={2}
                            />
                            <Balance
                                className="app-balance__value"
                                balance={p.snmBalance}
                                decimalPointOffset={18}
                                symbol="SNM"
                                decimalDigitAmount={2}
                            />
                        </div>
                        <div className="app-balance__row">
                            <span className="app-balance__label">On SONM:</span>
                            <Balance
                                className="app-balance__value"
                                balance={p.etherBalance}
                                decimalPointOffset={18}
                                symbol="SNM"
                                decimalDigitAmount={2}
                            />
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="app-balance__row">
                        <span className="app-balance__label">
                            Current deals:
                        </span>
                        <span className="app-balance__value">
                            {p.ratePerDay} USD/day {p.daysLeft} days left
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

// TODO plural form for "days"

export default AppBalance;
