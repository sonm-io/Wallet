import * as React from 'react';
import * as cn from 'classnames';
import { ICertificateProps, Certificate } from '../certificate';
import { Button } from 'app/components/common/button';
import { Panel } from 'app/components/common/panel';

interface IProps {
    className?: string;
    certificates: ICertificateProps[];
    my: boolean;
}

export class CertificatesPanel extends React.Component<IProps, any> {
    public render() {
        const p = this.props;

        return (
            <Panel
                className={cn(p.className, 'sonm-certificates', {
                    'sonm-certificates__my': p.my,
                    'sonm-certificates__empty': p.certificates.length === 0,
                })}
                title="Certificates"
            >
                <div className="sonm-certificates__content">
                    {p.certificates.map((props, idx) => (
                        <Certificate key={idx} {...props} />
                    ))}
                </div>
                {p.my && (
                    <Button className="sonm-certificates__get-button">
                        GET CERTIFICATION
                    </Button>
                )}
            </Panel>
        );
    }
}
