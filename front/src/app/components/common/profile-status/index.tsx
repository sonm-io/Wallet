import * as React from 'react';
import { EProfileStatus } from 'app/api/types';

interface IProfileStatus {
    status: EProfileStatus;
}

export class ProfileStatus extends React.Component<IProfileStatus, never> {
    public render() {
        const p = this.props;

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

        const cls = `sonm-profile-status__${key}`;
        return <div className={cls}>{name}</div>;
    }
}

export default ProfileStatus;
