import * as React from 'react';
import { Input, IPasswordInputProps } from 'app/components/common/input';
import { Icon } from 'app/components/common/icon';

interface IState {
    showPassword: boolean;
}

export class Password extends React.Component<IPasswordInputProps, IState> {
    constructor(props: IPasswordInputProps) {
        super(props);
        this.state = { showPassword: false };
    }

    protected handleClickEye = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    protected renderEye = () => {
        return (
            <button
                className="password__eye-button"
                onClick={this.handleClickEye}
            >
                <Icon i={this.state.showPassword ? 'EyeOff' : 'Eye'} />
            </button>
        );
    };

    public render() {
        return (
            <Input
                {...this.props}
                type={this.state.showPassword ? 'text' : 'password'}
                postfix={this.renderEye()}
            />
        );
    }
}
