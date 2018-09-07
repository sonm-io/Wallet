import * as React from 'react';
import * as cn from 'classnames';
import { ProfileStatus } from '../profile-status/index';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';
import { Balance } from 'app/components/common/balance-view';
import { EnumProfileStatus } from 'common/types/profile-status';

interface IProfile {
    name?: string;
    address: string;
    status: EnumProfileStatus;
    logoUrl?: string;
}

interface IBalances {
    marketBalance: string;
    etherBalance: string;
    primaryTokenBalance: string;
}

interface IProfileBriefProps {
    profile: IProfile;
    balances?: IBalances;
    className?: string;
    logoSizePx?: number;
}

export function ProfileBrief(props: IProfileBriefProps) {
    const { profile, balances } = props;
    return (
        <div className={cn(props.className, 'sonm-profile-brief')}>
            {profile.logoUrl ? (
                <img
                    src={profile.logoUrl}
                    className="sonm-profile-brief__logo"
                />
            ) : (
                <IdentIcon
                    address={profile.address}
                    className="sonm-profile-brief__logo"
                    sizePx={props.logoSizePx}
                />
            )}
            {profile.name ? (
                <React.Fragment>
                    <div className="sonm-profile-brief__name sonm-profile-brief__ident-key">
                        Name
                    </div>
                    <div className="sonm-profile-brief__name sonm-profile-brief__ident-value">
                        {profile.name}
                    </div>
                </React.Fragment>
            ) : null}
            <div className="sonm-profile-brief__address sonm-profile-brief__ident-key">
                Address
            </div>
            <Hash
                className="sonm-profile-brief__address sonm-profile-brief__ident-value"
                hash={profile.address}
                hasCopyButton
            />
            <div className="sonm-profile-brief__status sonm-profile-brief__ident-key">
                Status
            </div>
            <ProfileStatus
                status={profile.status}
                className="sonm-profile-brief__status sonm-profile-brief__ident-value"
            />
            {balances !== undefined ? (
                <React.Fragment>
                    <div className="sonm-profile-brief__eth-balance">
                        <Balance
                            symbol="ETH"
                            className="sonm-profile-brief__balance"
                            decimalPointOffset={18}
                            balance={balances.etherBalance}
                        />
                        <Balance
                            symbol="SNM"
                            className="sonm-profile-brief__balance"
                            decimalPointOffset={18}
                            balance={balances.primaryTokenBalance}
                        />
                    </div>
                    <Balance
                        className="sonm-profile-brief__market-balance"
                        decimalPointOffset={18}
                        balance={balances.marketBalance}
                        prefix="SONM deposit: "
                    />
                </React.Fragment>
            ) : null}
        </div>
    );
}

export default ProfileBrief;
