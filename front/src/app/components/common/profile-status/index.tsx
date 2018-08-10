import * as React from 'react';
import * as cn from 'classnames';
import { EnumProfileStatus } from 'app/entities/account';

interface IProfileStatusProps {
    status: EnumProfileStatus;
    className?: string;
}

export function ProfileStatus(p: IProfileStatusProps) {
    let name = 'ANONYMOUS';
    let modifier = 'anon';

    if (p.status === EnumProfileStatus.reg) {
        name = 'REGISTERED';
        modifier = 'reg';
    } else if (p.status === EnumProfileStatus.ident) {
        name = 'IDENTIFIED';
        modifier = 'ident';
    } else if (p.status === EnumProfileStatus.pro) {
        name = 'PROFESSIONAL';
        modifier = 'pro';
    }

    return (
        <div
            className={cn(
                p.className,
                `sonm-profile-status sonm-profile-status--${modifier}`,
            )}
        >
            {name}
        </div>
    );
}

export default ProfileStatus;
