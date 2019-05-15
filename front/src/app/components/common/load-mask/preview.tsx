import * as React from 'react';
import { LoadMask } from './index';

export class LoadMaskPreview extends React.Component<any> {
    public state = {
        isLoadMaskVisible: false,
    };

    public handleClick = () => {
        if (!this.state.isLoadMaskVisible) {
            this.setState({ isLoadMaskVisible: true });
            setTimeout(
                () => this.setState({ isLoadMaskVisible: false }),
                this.props.delay,
            );
        }
    };

    public render() {
        return (
            <LoadMask visible={this.state.isLoadMaskVisible}>
                <button onClick={this.handleClick}>
                    {this.state.isLoadMaskVisible
                        ? `Please wait for ${this.props.delay} ms`
                        : `Show load mask (${this.props.delay} ms)`}
                </button>
            </LoadMask>
        );
    }
}
