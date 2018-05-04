import * as React from 'react';
import { IdentIcon } from '../../../ident-icon';
import { Balance } from '../../../balance-view';
import { Empty } from '../../../empty';

export interface ITokenItemProps {
    address: string;
    balance: string;
    symbol: string;
    decimalPointOffset: number;
}

export function TokenItem(props: ITokenItemProps) {
    return (
        <Empty>
            <IdentIcon
                key="i"
                address={props.address}
                sizePx={26}
                className="sonm-token-item__icon"
            />
            <Balance
                key="b"
                className="sonm-token-item__balance"
                balance={props.balance}
                symbol={props.symbol}
                decimalPointOffset={props.decimalPointOffset}
            />
        </Empty>
    );
}

export default TokenItem;
