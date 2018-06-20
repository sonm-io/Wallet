import * as React from 'react';
import * as cn from 'classnames';
import { Balance } from 'app/components/common/balance-view';

interface IAppBalanceProps {
    marketMode: boolean;
    etherBalance: string;
    snmBalance: string;
    usdBalance: string;
    marketBalance: string;
    marketDealsCount: number;
    marketDealsPrice: string;
    marketDaysLeft: number;
    className?: string;
}

export class AppBalance extends React.PureComponent<IAppBalanceProps, any> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('app-balance', p.className)}>
                {p.marketMode === false ? (
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
                            />,{' '}
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
                                balance={p.marketBalance}
                                decimalPointOffset={18}
                                symbol="SNM"
                                decimalDigitAmount={2}
                            />
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="app-balance__row">
                        <span className="app-balance__label">
                            Market stat:{' '}
                        </span>
                        <span className="app-balance__value">
                            {p.marketDealsCount} deals,{' '}
                            <Balance
                                className="app-balance__value"
                                balance={p.marketDealsPrice}
                                decimalPointOffset={18}
                                symbol="USD/h"
                                decimalDigitAmount={4}
                                round
                            />
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

// TODO plural form for "days"

export default AppBalance;
