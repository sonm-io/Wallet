const React = require('react');
const LoadMask = require('./index.tsx').LoadMask;

module.exports = class LoadMaskPreview extends React.Component {
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
};
