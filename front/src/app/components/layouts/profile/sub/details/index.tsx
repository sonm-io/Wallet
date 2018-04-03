import * as React from 'react';
import * as cn from 'classnames';
import { Panel } from '../panel';
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
    status: 0 | 1 | 2;
    address: string;
    getUiText: TFnGetUiText<string>;
    definitions: IProfileDefinition[];
}

export type TProfileDefinitionNames = 'Website' | 'E-mail' | 'Phone number';

export type TUiText =
    | 'Account details'
    | 'Status'
    | 'status_anon'
    | 'status_reg'
    | 'status_ident'
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

    protected getStatusText() {
        return this.props.status === 1
            ? 'status_reg'
            : this.props.status === 2 ? 'status_ident' : 'status_anon';
    }

    protected handleClickUrl(event: any) {
        event.preventDefault();
    }

    public render() {
        const p = this.props;
        const t = p.getUiText;
        const definitions: React.ReactNode[] = [];

        return (
            <Panel
                className={cn(p.className, 'sonm-profile-details')}
                title={t('Account details')}
            >
                <dl className="sonm-profile-details__main-info">
                    <dt>{t('Status')}</dt>
                    <dd>{t(this.getStatusText())}</dd>
                </dl>
                <div className="sonm-profile-details__address-panel">
                    <h4 className="sonm-profile-details__address-title">
                        {t('Account address')}
                    </h4>
                    <IdentIcon
                        className="sonm-profile-details__address-icon"
                        address={p.address}
                    />
                    <Hash
                        className="sonm-profile-details__address-hash"
                        hash={p.address}
                    />
                </div>
                <div className="sonm-profile-details__extra">
                    {
                        (p.definitions.forEach(({ label, value }) => {
                            const render =
                                (Details.profileDefinitionRenders as any)[
                                    label
                                ] || Details.defaultRender;

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
                {definitions.length > 3 && (
                    <span className="sonm-profile-details__show-more">
                        {t('Show more')}
                    </span>
                )}
            </Panel>
        );
    }
}

export default Details;
