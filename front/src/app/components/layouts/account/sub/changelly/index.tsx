import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { observer } from 'mobx-react';

export interface IProps {
    currency: string;
    onClickCross: () => void;
}

@observer
export class Changelly extends React.Component<IProps, {}> {
    public render() {
        const url = `https://changelly.com/widget/v1?auth=email&from=USD&to=${
            this.props.currency
        }&merchant_id=a836576e0207&address=0x0&amount=100&ref_id=a836576e0207&color=0B1D26`;
        return (
            <Dialog
                onClickCross={this.props.onClickCross}
                className="sonm-accounts__buy-sonm-dialog"
            >
                <iframe
                    src={url}
                    width="600"
                    height="500"
                    scrolling="no"
                    style={{ border: 'none' }}
                >
                    Can't load widget
                </iframe>
            </Dialog>
        );
    }
}

export default Changelly;
