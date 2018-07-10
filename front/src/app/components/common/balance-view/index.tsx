import * as React from 'react';

interface IBalanceViewProps {
    className?: string;
    balance?: string;
    symbol?: string;
    decimalDigitAmount?: number;
    prefix?: string;
    decimalPointOffset: number;
    round?: boolean;
}

import * as cn from 'classnames';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';

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

        this.state = {
            balance: props.balance,
            decimalDigitAmount: props.decimalDigitAmount,
            decimalPointOffset: props.decimalPointOffset,
            round: props.round,
            text: Balance.createStringRepresentation(props),
        };
    }

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
            return {
                balance: props.balance,
                decimalDigitAmount: props.decimalDigitAmount,
                decimalPointOffset: props.decimalPointOffset,
                round: props.round,
                text: Balance.createStringRepresentation(props),
            };
        }
        return null;
    }

    protected static limitDecimalDigitAmount(
        num: string,
        decimalDigitAmount: number,
    ) {
        const dotIdx = num.indexOf('.');

        return dotIdx !== -1
            ? num.slice(0, dotIdx + 1 + decimalDigitAmount)
            : num;
    }

    protected static removeTrailingPoint(str: string) {
        const len = str.length;
        return str[len - 1] === '.' ? str.slice(0, len - 1) : str;
    }

    protected static increaseInteger(n: string) {
        let i = n.length - 1;
        while (i >= 0 && n[i] === '9') {
            i--;
        }
        if (i === -1) {
            return '1' + '0'.repeat(n.length);
        }
        return (
            n.substr(0, i - 1) +
            (Number(n[i]) + 1) +
            '0'.repeat(n.length - i - 1)
        );
    }

    public static roundLastNumberPosition(num: string, justCutOff?: boolean) {
        let result = num;

        if (num.indexOf('.') > 0) {
            const lastIdx = num.length - 1;
            if (justCutOff || num[lastIdx] === '0') {
                result = num.slice(0, lastIdx);
            } else {
                const last = Number(num[lastIdx]);
                if (last < 5) {
                    result = num.slice(0, lastIdx);
                } else {
                    let idx = lastIdx - 1;
                    while (num[idx] === '9') {
                        --idx;
                    }
                    if (num[idx] === '.') {
                        result = Balance.increaseInteger(num.slice(0, idx));
                    } else {
                        const digit = Number(num[idx]);
                        result = num.slice(0, idx) + Number(digit + 1);
                    }
                }
            }
            result = Balance.removeTrailingPoint(result);
        }
        return result;
    }

    public static roundOrCrop(
        num: string,
        decimalDigitAmount: number,
        round?: boolean,
    ): string {
        let result = Balance.limitDecimalDigitAmount(
            num,
            decimalDigitAmount + 1,
        );
        const pointIndex = result.indexOf('.');
        if (
            pointIndex > -1 &&
            result.substr(pointIndex + 1).length > decimalDigitAmount
        ) {
            result = Balance.roundLastNumberPosition(result, !round);
        }
        return result;
    }

    public static createStringRepresentation(props: IBalanceViewProps): string {
        const {
            decimalPointOffset = 18,
            decimalDigitAmount = 4,
            balance,
            round,
        } = props;

        let result = '';

        if (balance !== undefined && balance !== '') {
            result = moveDecimalPoint(balance, -decimalPointOffset);
            result = Balance.roundOrCrop(result, decimalDigitAmount, round);
        }

        return result;
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
