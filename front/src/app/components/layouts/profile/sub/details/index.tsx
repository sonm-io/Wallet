import * as React from 'react';
import * as cn from 'classnames';
import { ShowMorePanel } from 'app/components/common/show-more-panel';
import { TFnGetUiText } from 'app/components/common/localized-pure-component';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';

export interface IProfileDefinition {
    label: string;
    value: string;
}

interface IProps {
    className?: string;
    children?: never;
    userName: string;
    status: number;
    country: string;
    countryFlagUrl: string;
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

    protected getStatusText(): string {
        return this.props.status === 1
            ? 'REGISTERED'
            : this.props.status === 2 ? 'IDENTIFIED' : 'ANONIMOUS';
    }

    protected handleClickUrl(event: any) {
        event.preventDefault();
    }

    public render() {
        const p = this.props;
        const t = p.getUiText;
        const definitions: React.ReactNode[] = [];
        const renders = Details.profileDefinitionRenders as any;
        const statusText = this.getStatusText();

        return (
            <ShowMorePanel
                className={cn(p.className, 'sonm-profile-details')}
                title={t('Account details')}
                showMoreContentStepPx={30}
                showMoreContent={
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
                                    </dd>,
                                );
                            }),
                            definitions)
                        }
                    </div>
                }
            >
                <dl className="sonm-profile-details__main-info">
                    {!!p.userName && <dt key="nk">{t('Name')}</dt>}
                    {!!p.userName && <dd key="nv">{p.userName}</dd>}

                    <dt key="sk">{t('Status')}</dt>
                    <dd
                        key="sv"
                        className={`sonm-profile-details__status sonm-profile-details__status--${
                            p.status
                        }`}
                    >
                        {t(statusText)}
                    </dd>

                    {!!p.country && <dt key="ck">{t('Country')}</dt>}
                    {!!p.country && (
                        <dd key="cv" className="sonm-profile-details__country">
                            {t(p.country)}
                            <img
                                className="sonm-profile-details__country-flag"
                                src={p.countryFlagUrl}
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
                {definitions.length === 0 && (
                    <span className="sonm-profile-details__certificate">
                        {t('before_certification_link')}
                        <a
                            href="#go-to-instruction"
                            onClick={this.handleClickUrl}
                        >
                            {t('certification_link')}
                        </a>
                        {t('after_certification_link')}
                    </span>
                )}
            </ShowMorePanel>
        );
    }
}

export default Details;
