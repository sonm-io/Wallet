import * as React from 'react';
import { Input, IPasswordInputProps } from 'app/components/common/input';
import { Icon } from 'app/components/common/icon';
import * as cn from 'classnames';

interface IState {}

export class Password extends React.Component<IPasswordInputProps, IState> {
    public render() {
        return (
            <div
                className={cn('password', this.props.className, {
                    'password--readonly': this.props.readOnly,
                })}
            >
                <Input
                    {...this.props}
                    className="password__input"
                    type="password"
                />
                <div className="password__icon-container">
                    <Icon i="Exit" />
                    <div className="password__underline" />
                </div>
            </div>
        );
    }
}
