import { Balance } from '../balance-view/index';
import * as React from 'react';
import { BN } from 'bn.js';

interface IState {
    usdWeiPerHour: string;
    usdWeiPerSeconds: string;
}

interface IProps {
    usdWeiPerSeconds: string;
    className?: string;
}

const SEC_IN_HOUR = new BN('3600');

export class PricePerHour extends React.PureComponent<IProps, IState> {
    public state = {
        usdWeiPerHour: '',
        usdWeiPerSeconds: '',
    };

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        if (state.usdWeiPerSeconds !== props.usdWeiPerSeconds) {
            return {
                usdWeiPerHour: new BN(props.usdWeiPerSeconds)
                    .mul(SEC_IN_HOUR)
                    .toString(),
            };
        }
        return null;
    }

    public render() {
        return (
            <Balance
                className={this.props.className}
                balance={this.state.usdWeiPerHour}
                decimalDigitAmount={4}
                decimalPointOffset={18}
                symbol="USD/h"
                round
            />
        );
    }
}

export default PricePerHour;
