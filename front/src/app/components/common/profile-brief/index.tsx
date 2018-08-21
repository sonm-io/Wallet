import * as React from 'react';
import * as cn from 'classnames';
import { IProfileBrief } from 'app/entities/profile';
import { ProfileStatus } from '../profile-status/index';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';
import { Balance } from 'app/components/common/balance-view';

interface IProps {
    profile: IProfileBrief;
    className?: string;
    showBalances?: boolean;
    logoSizePx?: number;
}

export function ProfileBrief(props: IProps) {
    return (
        <div className={cn(props.className, 'sonm-profile-brief')}>
            {props.profile.logoUrl ? (
                <img
                    src={props.profile.logoUrl}
                    className="sonm-profile-brief__logo"
                />
            ) : (
                <IdentIcon
                    address={props.profile.address}
                    className="sonm-profile-brief__logo"
                    sizePx={props.logoSizePx}
                />
            )}
            {props.profile.name ? (
                <React.Fragment>
                    <div className="sonm-profile-brief__name sonm-profile-brief__ident-key">
                        Name
                    </div>
                    <div className="sonm-profile-brief__name sonm-profile-brief__ident-value">
                        {props.profile.name}
                    </div>
                </React.Fragment>
            ) : null}
            <div className="sonm-profile-brief__address sonm-profile-brief__ident-key">
                Address
            </div>
            <Hash
                className="sonm-profile-brief__address sonm-profile-brief__ident-value"
                hash={props.profile.address}
                hasCopyButton
            />
            <div className="sonm-profile-brief__status sonm-profile-brief__ident-key">
                Status
            </div>
            <ProfileStatus
                status={props.profile.status}
                className="sonm-profile-brief__status sonm-profile-brief__ident-value"
            />
            {props.showBalances ? (
                <React.Fragment>
                    <div className="sonm-profile-brief__eth-balance">
                        {props.profile.etherBalance !== undefined ? (
                            <Balance
                                symbol="ETH"
                                className="sonm-profile-brief__balance"
                                decimalPointOffset={18}
                                balance={props.profile.etherBalance}
                            />
                        ) : null}
                        {props.profile.snmBalance !== undefined ? (
                            <Balance
                                symbol="SNM"
                                className="sonm-profile-brief__balance"
                                decimalPointOffset={18}
                                balance={props.profile.snmBalance}
                            />
                        ) : null}
                    </div>
                    {props.profile.marketBalance !== undefined ? (
                        <Balance
                            className="sonm-profile-brief__market-balance"
                            decimalPointOffset={18}
                            balance={props.profile.marketBalance}
                            prefix="SONM deposit: "
                        />
                    ) : null}
                </React.Fragment>
            ) : null}
        </div>
    );
}

export default ProfileBrief;
