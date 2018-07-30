import * as React from 'react';
import { Icon } from 'app/components/common/icon';
import * as cn from 'classnames';

export interface IChangeRequestParamProps {
    className?: string;
    name: string;
    initialValue: string;
    changedValue: string;
    hasAdvantage?: boolean;
}

export class ChangeRequestParam extends React.Component<
    IChangeRequestParamProps,
    never
> {
    public render() {
        const p = this.props;
        const changedValueCss =
            'change-request-param__value' +
            (p.hasAdvantage === true
                ? '--better'
                : p.hasAdvantage === false
                    ? '--worse'
                    : '');
        return (
            <div className={cn('change-request-param', p.className)}>
                <div className="change-request-param__name">{p.name}: </div>
                <div className="change-request-param__value">
                    {p.initialValue}
                </div>
                <Icon i="ArrowRight" className="change-request-param__icon" />
                <div
                    className={'change-request-param__value ' + changedValueCss}
                >
                    {p.changedValue}
                </div>
            </div>
        );
    }
}
