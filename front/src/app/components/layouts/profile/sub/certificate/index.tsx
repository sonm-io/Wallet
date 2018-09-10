import * as React from 'react';
import * as cn from 'classnames';
import { ProfileStatus } from 'app/components/common/profile-status/index';
import { EnumProfileStatus } from 'common/types/profile-status';

export interface ICertificateProps {
    className?: string;
    serviceName: string;
    status: EnumProfileStatus;
}

export class Certificate extends React.Component<ICertificateProps, any> {
    public static mapStatusToStyle: { [key: string]: string } = {
        [String(EnumProfileStatus.undefined)]: 'anon',
        [String(EnumProfileStatus.anon)]: 'anon',
        [String(EnumProfileStatus.reg)]: 'reg',
        [String(EnumProfileStatus.ident)]: 'ident',
        [String(EnumProfileStatus.pro)]: 'pro',
    };

    public render() {
        const p = this.props;
        const style = Certificate.mapStatusToStyle[String(p.status)];

        return (
            <div
                className={cn(
                    p.className,
                    'sonm-certificate',
                    `sonm-certificate--${style}`,
                )}
            >
                <ProfileStatus
                    className="sonm-certificate__status"
                    status={p.status}
                />
                <div className="sonm-certificate__service">
                    by {p.serviceName}
                </div>
                <div
                    className={`sonm-certificate__logo sonm-certificate__logo--${style}`}
                />
            </div>
        );
    }
}
