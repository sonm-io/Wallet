import * as React from 'react';
import { EnumProfileStatus } from 'app/api/types';

interface IProfileStatusProps {
    status: EnumProfileStatus;
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

    return <div className={`sonm-profile-status--${modifier}`}>{name}</div>;
}

export default ProfileStatus;
