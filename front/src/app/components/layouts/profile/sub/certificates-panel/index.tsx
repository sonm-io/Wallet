import * as React from 'react';
import * as cn from 'classnames';
import { ICertificateProps, Certificate } from '../certificate';
import { Button } from 'app/components/common/button';
import { Panel } from '../panel';

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
            >
                {p.certificates.map(props => <Certificate {...props} />)}
                {p.my && <Button>GET CERTIFICATION</Button>}
                <a className="sonm-certificates__show-more">Show more</a>
            </Panel>
        );
    }
}
