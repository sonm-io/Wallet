import * as React from 'react';
import { Input } from 'app/components/common/input';
import { Icon } from 'app/components/common/icon';
import { IChengableProps } from '../types';

export interface IPasswordInputProps extends IChengableProps<string> {
    autoFocus?: boolean;
    prefix?: string;
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
}

interface IState {
    showPassword: boolean;
    passwordInput?: Input;
}

export class Password extends React.Component<IPasswordInputProps, IState> {
    constructor(props: IPasswordInputProps) {
        super(props);
        this.state = { showPassword: false };
    }

    protected handleClickEye = () => {
        this.setState({ showPassword: !this.state.showPassword });
        if (this.state.passwordInput) {
            this.state.passwordInput.focus();
        }
    };

    protected handleRefInput = (input: Input) => {
        this.setState({ passwordInput: input });
    };

    protected renderEye = () => {
        return (
            <Icon
                className="password__eye-button"
                tag="button"
                i={this.state.showPassword ? 'EyeOff' : 'Eye'}
                onClick={this.handleClickEye}
            />
        );
    };

    public render() {
        return (
            <Input
                ref={this.handleRefInput}
                {...this.props}
                type={this.state.showPassword ? 'text' : 'password'}
                postfix={this.renderEye()}
            />
        );
    }
}
