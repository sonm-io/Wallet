import * as React from 'react';
import * as cn from 'classnames';
import { Panel } from 'app/components/common/panel';
import { LocalizedPureComponent } from 'app/components/common/localized-pure-component';

export type TUiText =
    | 'As a consumer'
    | 'As a supplier'
    | 'Deals count'
    | 'Deal average time'
    | 'Tokens overall'
    | 'SONM Statisctic';

interface IProps {
    className?: string;
    consumerDeals: string;
    consumerAvgTime: string;
    consumerToken: string;
    supplierDeals: string;
    supplierAvgTime: string;
    supplierToken: string;
    getUiText: (text: TUiText, args?: any[]) => string;
}

export class Statistic extends LocalizedPureComponent<IProps, never, TUiText> {
    public render() {
        const p = this.props;
        const t = p.getUiText;

        return (
            <Panel
                title={t('SONM Statisctic')}
                className={cn('sonm-profile-stats', this.props.className)}
            >
                <table className="sonm-profile-stats__table">
                    <tbody>
                        <tr>
                            <th className="sonm-profile-stats__header">{}</th>
                            <th className="sonm-profile-stats__header--consumer">
                                {t('As a consumer')}
                            </th>
                            <th className="sonm-profile-stats__header--supplier">
                                {t('As a supplier')}
                            </th>
                        </tr>
                        <tr>
                            <td className="sonm-profile-stats__cell">
                                {t('Deals count')}
                            </td>
                            <td className="sonm-profile-stats__cell">
                                {p.consumerDeals}
                            </td>
                            <td className="sonm-profile-stats__cell">
                                {p.supplierDeals}
                            </td>
                        </tr>
                        <tr>
                            <td className="sonm-profile-stats__cell">
                                {t('Deal average time')}
                            </td>
                            <td className="sonm-profile-stats__cell">
                                {p.consumerAvgTime}
                            </td>
                            <td className="sonm-profile-stats__cell">
                                {p.supplierAvgTime}
                            </td>
                        </tr>
                        <tr>
                            <td className="sonm-profile-stats__cell">
                                {t('Tokens overall')}
                            </td>
                            <td className="sonm-profile-stats__cell">
                                {p.consumerToken}
                            </td>
                            <td className="sonm-profile-stats__cell">
                                {p.supplierToken}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        );
    }
}
