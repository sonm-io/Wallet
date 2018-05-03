import * as React from 'react';
import { EProfileStatus } from 'app/api/types';

interface IProfileStatusProps {
    status: EProfileStatus;
}

export function ProfileStatus(p: IProfileStatusProps) {
    let name = 'ANONYMOUS';
    let key = 'reg';

    if (p.status === EProfileStatus.reg) {
        name = 'REGISTERED';
        key = 'reg';
    } else if (p.status === EProfileStatus.ident) {
        name = 'IDENTIFIED';
        key = 'ident';
    } else if (p.status === EProfileStatus.full) {
        name = 'FULL KYC';
        key = 'full';
    } else if (p.status === EProfileStatus.pro) {
        name = 'PROFESSIONAL';
        key = 'pro';
    }

    return <div className={`sonm-profile-status--${key}`}>{name}</div>;
}

export default ProfileStatus;
