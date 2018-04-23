import * as React from 'react';
import * as cn from 'classnames';
import { TFnGetUiText } from 'app/components/common/localized-pure-component';
import { Details, IProfileDefinition } from './sub/details';
import { Statistic } from './sub/statistic';
import { ICertificateProps } from './sub/certificate';
import { CertificatesPanel } from './sub/certificates-panel';
import { Panel } from 'app/components/common/panel';

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
    countryAbCode2: string;
    logoUrl: string;
    userStatus: number;
    address: string;
    style?: any;
}

export class ProfileView extends React.PureComponent<IProps, never> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-profile', p.className)} style={p.style}>
                <div className="sonm-profile__column">
                    <Details
                        userName={p.userName}
                        countryAbCode2={p.countryAbCode2}
                        logoUrl={p.logoUrl}
                        className="sonm-profile__panel"
                        status={p.userStatus}
                        address={p.address}
                        getUiText={p.getUiText}
                        definitions={p.definitionList}
                    />
                    {p.description ? (
                        <Panel
                            key="desc"
                            className="sonm-profile__panel"
                            title="Description"
                        >
                            {p.description}
                        </Panel>
                    ) : null}
                </div>
                <div className="sonm-profile__column">
                    <CertificatesPanel
                        className="sonm-profile__panel"
                        certificates={p.certificates}
                        my={p.my}
                    />
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
                </div>
            </div>
        );
    }
}

export default ProfileView;
