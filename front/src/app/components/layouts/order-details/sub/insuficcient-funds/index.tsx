import * as React from 'react';
import Button from 'app/components/common/button';
import * as cn from 'classnames';

export interface IInsuficcientFundsProps {
    onBack: () => void;
    onDeposit: () => void;
    className?: string;
}

export class InsuficcientFunds extends React.Component<
    IInsuficcientFundsProps,
    never
> {
    public render() {
        const p = this.props;
        return (
            <div className={cn('insuficcient-funds', p.className)}>
                <h4 className="insuficcient-funds__header">
                    Insufficient funds for a deal
                </h4>
                <div className="insuficcient-funds__message">
                    Choose another order or replenish your deposit
                </div>
                <Button
                    color="violet"
                    className="insuficcient-funds__button-deposit"
                    onClick={p.onDeposit}
                >
                    DEPOSIT
                </Button>
                <Button
                    color="violet"
                    transparent
                    className="insuficcient-funds__button-back"
                    onClick={p.onBack}
                >
                    BACK
                </Button>
            </div>
        );
    }
}
