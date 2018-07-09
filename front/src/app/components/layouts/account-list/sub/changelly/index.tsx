import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { observer } from 'mobx-react';

export interface IProps {
    onClickCross: () => void;
}

@observer
export class Changelly extends React.Component<IProps, {}> {
    public render() {
        return (
            <Dialog
                onClickCross={this.props.onClickCross}
                className="sonm-accounts__buy-sonm-dialog"
            >
                <iframe
                    src="https://changelly.com/widget/v1?auth=email&from=USD&to=SNM&merchant_id=a836576e0207&address=&amount=100&ref_id=a836576e0207&color=0B1D26"
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
