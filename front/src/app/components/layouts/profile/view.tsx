import * as React from 'react';
import * as cn from 'classnames';
import { TFnGetUiText } from 'app/components/common/localized-pure-component';
import { Details, IProfileDefinition } from './sub/details';
import { Statistic } from './sub/statistic';
import { ICertificateProps } from './sub/certificate';
import { CertificatesPanel } from './sub/certificates-panel';
import { Panel } from './sub/panel';

interface IProps {
    className?: string;
    getUiText: TFnGetUiText<any>;
    definitionList: IProfileDefinition[];
    certificates: ICertificateProps[];
    description: string;
    consumerDeals: string;
    consumerAvgTime: string;
    consumerToken: string;
    supplierDeals: string;
    supplierAvgTime: string;
    supplierToken: string;
    my: boolean;
    userName: string;
    country: string;
    logoUrl: string;
    countryFlagUrl: string;
}

export class ProfileView extends React.PureComponent<IProps, never> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-profile', p.className)}>
                <div className="sonm-profile__row sonm-profile__row--top">
                    <Details
                        userName={p.userName}
                        country={p.country}
                        countryFlagUrl={p.countryFlagUrl}
                        logoUrl={p.logoUrl}
                        className="sonm-profile__panel"
                        status={0}
                        address={'0x0'}
                        getUiText={p.getUiText}
                        definitions={p.definitionList}
                    />
                    <CertificatesPanel
                        className="sonm-profile__panel"
                        certificates={p.certificates}
                        my={p.my}
                    />
                </div>
                <div className="sonm-profile__row sonm-profile__row--bottom">
                    {p.description ? (
                        <Panel
                            key="desc"
                            className="sonm-profile__panel"
                            title="Description"
                        >
                            {p.description}
                        </Panel>
                    ) : null}
                    {
                        <Statistic
                            className="sonm-profile__panel"
                            consumerDeals={p.consumerDeals}
                            consumerAvgTime={p.consumerAvgTime}
                            consumerToken={p.consumerToken}
                            supplierDeals={p.supplierDeals}
                            supplierAvgTime={p.supplierAvgTime}
                            supplierToken={p.supplierToken}
                            getUiText={p.getUiText}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default ProfileView;
