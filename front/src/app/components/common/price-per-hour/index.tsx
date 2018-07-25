import { Balance } from '../balance-view/index';
import * as React from 'react';
import { getPricePerHour } from './utils';

interface IState {
    usdWeiPerHour: string;
    usdWeiPerSeconds: string;
}

interface IProps {
    usdWeiPerSeconds: string;
    className?: string;
}

export class PricePerHour extends React.PureComponent<IProps, IState> {
    public state = {
        usdWeiPerHour: '',
        usdWeiPerSeconds: '',
    };

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        if (state.usdWeiPerSeconds !== props.usdWeiPerSeconds) {
            return {
                usdWeiPerHour: getPricePerHour(props.usdWeiPerSeconds),
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
