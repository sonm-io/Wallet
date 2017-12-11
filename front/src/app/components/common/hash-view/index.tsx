import * as React from 'react';

const LAST_SYMBOL_AMOUNT = 6;

interface IBalanceViewProps {
    className?: string;
    fontSizePx?: number;
    hash: string;
    prefix?: string;
}

import * as cn from 'classnames';

export class Hash extends React.PureComponent<IBalanceViewProps, any> {

    public render() {
        const { className, fontSizePx, hash, prefix } = this.props;

        const hash0x =  hash.startsWith('0x') ? hash : '0x' + hash;

        const len = hash0x.length;
        let start = hash0x;
        let end = '';

        if (len > LAST_SYMBOL_AMOUNT) {
            start = hash0x.slice(0, len - LAST_SYMBOL_AMOUNT);
            end = hash0x.slice(len - LAST_SYMBOL_AMOUNT);
        }

        const style = fontSizePx
            ? { fontSize: `${fontSizePx}px` }
            : undefined;

        return (
            <div
                className={cn('sonm-hash', className)}
                style={style}
            >
                <span className="sonm-hash__end">
                    {end}
                </span>
                <span className="sonm-hash__start">
                    {prefix} {start}
                </span>
            </div>
        );
    }
}

export default Hash;
