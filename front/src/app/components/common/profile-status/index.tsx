import * as React from 'react';
import { EProfileStatus } from 'app/api/types';

interface IProfileStatusProps {
    status: EProfileStatus;
}

export function ProfileStatus(p: IProfileStatusProps) {
    let name = 'ANONYMOUS';
    let modifier = 'anon';

    if (p.status === EProfileStatus.reg) {
        name = 'REGISTERED';
        modifier = 'reg';
    } else if (p.status === EProfileStatus.ident) {
        name = 'IDENTIFIED';
        modifier = 'ident';
    } else if (p.status === EProfileStatus.pro) {
        name = 'PROFESSIONAL';
        modifier = 'pro';
    }

    return <div className={`sonm-profile-status--${modifier}`}>{name}</div>;
}

export default ProfileStatus;
