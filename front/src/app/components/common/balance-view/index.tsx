import * as React from 'react';
import * as cn from 'classnames';
import { BalanceUtils } from './utils';

interface IBalanceViewProps {
    className?: string;
    balance?: string;
    symbol?: string;
    decimalDigitAmount?: number;
    prefix?: string;
    decimalPointOffset: number;
    round?: boolean;
}

interface IState {
    text: string;
    balance?: string;
    decimalDigitAmount?: number;
    decimalPointOffset?: number;
    round?: boolean;
}

export class Balance extends React.PureComponent<IBalanceViewProps, IState> {
    public constructor(props: IBalanceViewProps) {
        super(props);

        this.state = Balance.getStateFromProps(props);
    }

    private static getStateFromProps = (props: IBalanceViewProps) => ({
        balance: props.balance,
        decimalDigitAmount: props.decimalDigitAmount,
        decimalPointOffset: props.decimalPointOffset,
        round: props.round,
        text: BalanceUtils.formatBalance(
            props.balance,
            props.decimalDigitAmount,
            props.decimalPointOffset,
            props.round,
        ),
    });

    public static getDerivedStateFromProps(
        props: IBalanceViewProps,
        state: IState,
    ) {
        if (
            props.balance !== state.balance ||
            props.decimalPointOffset !== state.decimalPointOffset ||
            props.decimalDigitAmount !== state.decimalDigitAmount ||
            props.round !== state.round
        ) {
            return Balance.getStateFromProps(props);
        }
        return null;
    }

    public render() {
        const { className, prefix, symbol } = this.props;

        return (
            <div
                className={cn('sonm-balance', className)}
                data-display-id="balance"
            >
                <span className="sonm-balance__number">
                    {prefix ? `${prefix} ` : null}
                    {this.state.text}
                </span>
                {symbol ? (
                    <span className="sonm-balance__symbol">{symbol}</span>
                ) : null}
            </div>
        );
    }
}

export default Balance;
