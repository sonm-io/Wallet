import * as React from 'react';
import * as cn from 'classnames';
import Button from 'app/components/common/button';

export interface IDealListEmptyProps {
    className?: string;
    onClickViewMarket: () => void;
    onClickBuyResources: () => void;
}

export class DealListEmpty extends React.Component<IDealListEmptyProps, never> {
    public render() {
        return (
            <div className={cn('deal-list-empty', this.props.className)}>
                <div className="deal-list-empty__icon" />
                <h1 className="deal-list-empty__header">
                    This is deals list page
                </h1>
                <div className="deal-list-empty__text">
                    <p className="deal-list-empty__paragraph">
                        Here you will see a list of your transactions.
                    </p>
                    <p className="deal-list-empty__paragraph">
                        Click on the buttons below to purchase resources on
                        SONM.
                    </p>
                </div>
                <div className="deal-list-empty__buttons">
                    <Button
                        className="deal-list-empty__button deal-list-empty__button-market"
                        color="violet"
                        onClick={this.props.onClickViewMarket}
                    >
                        VIEW MARKET
                    </Button>
                    {/*
                    Hide this button until the resource page will be released
                    <Button
                        className="deal-list-empty__button"
                        color="violet"
                        onClick={this.props.onClickBuyResources}
                    >
                        BUY RESOURSES
                    </Button> */}
                </div>
            </div>
        );
    }
}
