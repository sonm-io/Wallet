import * as React from 'react';
import * as cn from 'classnames';
import { Panel } from 'app/components/common/panel';
import { TFnGetUiText } from 'app/components/common/localized-pure-component';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';
import { InfoBalloon } from 'app/components/common/info-balloon';
import { Country } from 'app/components/common/country';
import { EProfileStatus } from 'app/api/types';
import { ProfileStatus } from 'app/components/common/profile-status';

export interface IProfileDefinition {
    label: string;
    value: string;
}

interface IProps {
    className?: string;
    children?: never;
    userName: string;
    status: EProfileStatus;
    countryAbCode2: string;
    address: string;
    logoUrl: string;
    getUiText: TFnGetUiText<string>;
    definitions: IProfileDefinition[];
}

export type TProfileDefinitionNames = 'Website' | 'E-mail' | 'Phone number';

export type TUiText =
    | 'Account details'
    | 'Status'
    | 'status-anon'
    | 'status-reg'
    | 'status-ident'
    | 'Status'
    | 'Account address'
    | 'before_certification_link'
    | 'certification_link'
    | 'after_certification_link'
    | 'Show more'
    | TProfileDefinitionNames;

export type TProfileDefinitionRenders = {
    [k in TProfileDefinitionNames]: (value: any) => React.ReactNode
};

export class Details extends React.PureComponent<IProps, TUiText> {
    protected static defaultRender = (value: any) => String(value);

    protected static profileDefinitionRenders: Partial<
        TProfileDefinitionRenders
    > = {
        Website: Details.defaultRender,
    };

    public static defaultProps = {
        definitions: [],
        getUiText: (s: string, args: any[]) => s,
    };

    protected handleClickUrl(event: any) {
        event.preventDefault();
    }

    public render() {
        const p = this.props;
        const t = p.getUiText;
        const definitions: React.ReactNode[] = [];
        const renders = Details.profileDefinitionRenders as any;

        return (
            <Panel
                className={cn(p.className, 'sonm-profile-details')}
                title={t('Account details')}
            >
                <dl className="sonm-profile-details__main-info">
                    {!!p.userName && <dt key="nk">{t('Name')}</dt>}
                    {!!p.userName && <dd key="nv">{p.userName}</dd>}

                    <dt key="sk">{t('Status')}</dt>
                    <dd key="sv" className={`sonm-profile-details__status`}>
                        <ProfileStatus status={p.status} />
                    </dd>

                    {!!p.countryAbCode2 && <dt key="ck">{t('Country')}</dt>}
                    {!!p.countryAbCode2 && (
                        <dd key="cv" className="sonm-profile-details__country">
                            <Country
                                abCode2={p.countryAbCode2}
                                hasName
                                flagHeightPx={20}
                            />
                        </dd>
                    )}
                </dl>
                <div className="sonm-profile-details__address-panel">
                    <h4 className="sonm-profile-details__address-title">
                        {t('Account address')}
                    </h4>
                    <IdentIcon
                        width={50}
                        className="sonm-profile-details__address-icon"
                        address={p.address}
                    />
                    <Hash
                        hasCopyButton
                        className="sonm-profile-details__address-hash"
                        hash={p.address}
                    />
                </div>
                <div className="sonm-profile-details__extra">
                    {
                        (p.definitions.forEach(({ label, value }) => {
                            const render =
                                label in renders
                                    ? renders[label]
                                    : Details.defaultRender;

                            definitions.push(
                                <dt
                                    key={label}
                                    className="sonm-profile-details__extra-label"
                                >
                                    {t(label)}
                                </dt>,
                                <dd
                                    key={`${label}^*`}
                                    className="sonm-profile-details__extra-value"
                                >
                                    {render(value)}
                                    <InfoBalloon className="sonm-profile-details__extra-info">
                                        {'text'}
                                    </InfoBalloon>
                                </dd>,
                            );
                        }),
                        definitions)
                    }
                </div>
                {/*{definitions.length === 0 && (*/}
                {/*<span className="sonm-profile-details__certificate">*/}
                {/*{t('before_certification_link')}*/}
                {/*<a*/}
                {/*href="#go-to-instruction"*/}
                {/*onClick={this.handleClickUrl}*/}
                {/*>*/}
                {/*{t('certification_link')}*/}
                {/*</a>*/}
                {/*{t('after_certification_link')}*/}
                {/*</span>*/}
                {/*)}*/}
            </Panel>
        );
    }
}

export default Details;
