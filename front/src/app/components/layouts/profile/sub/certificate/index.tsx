import * as React from 'react';
import * as cn from 'classnames';

export interface ICertificateProps {
    className?: string;
    status: string;
    service: any;
    style: 'blue' | 'gold' | 'silver';
}

export class Certificate extends React.Component<ICertificateProps, any> {
    public render() {
        const p = this.props;

        return (
            <div
                className={cn(
                    p.className,
                    'sonm-certificate',
                    `sonm-certificate__${p.style}`,
                )}
            >
                <span className="sonm-certificate__status">{p.status}</span>
                <span className="sonm-certificate__service">
                    by {p.service}
                </span>
                <div className="sonm-certificate__logo" />
            </div>
        );
    }
}
