import * as React from 'react';
import * as cn from 'classnames';
import { IChengableProps, IFocusable } from '../types';

export interface IPasswordInputProps extends IChengableProps<string> {
    name: string;
    autoFocus?: boolean;
    prefix?: string;
    onChangeDeprecated?: (event: any) => void;
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
}

export interface ITextInputProps extends IPasswordInputProps {
    type?: 'text' | 'password';
    allowAutoComplete?: boolean;
    postfix?: JSX.Element;
}

export class Input extends React.Component<ITextInputProps, never>
    implements IFocusable {
    protected inputNode: IFocusable | null = null;

    public static defaultValues = {
        value: '',
        type: 'text',
    };

    protected saveRef = (ref: HTMLInputElement) => {
        if (this.props.autoFocus && !this.inputNode && ref !== null) {
            ref.focus();
        }
        this.inputNode = ref;
    };

    protected handleChange = (event: any) => {
        const value = event.target.value;

        if (this.props.onChangeDeprecated) {
            this.props.onChangeDeprecated(event);
        }

        if (this.props.onChange) {
            this.props.onChange({
                name: this.props.name,
                value,
            });
        }

        this.setState({
            value,
        });
    };

    public render() {
        const {
            type,
            readOnly,
            allowAutoComplete,
            prefix,
            className,
            name,
            placeholder,
            value,
            postfix,
        } = this.props;

        return (
            <div
                className={cn('sonm-input', className, {
                    'sonm-input--readonly': readOnly,
                })}
            >
                {prefix ? (
                    <span className="sonm-input__prefix">{prefix}</span>
                ) : null}
                <input
                    className="sonm-input__input"
                    type={type}
                    ref={this.saveRef}
                    autoComplete={allowAutoComplete ? 'on' : 'off'}
                    name={name}
                    value={value}
                    onChange={this.handleChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                />
                {postfix ? postfix : null}
                <div className="sonm-input__underline" />
            </div>
        );
    }

    public focus() {
        if (this.inputNode) {
            this.inputNode.focus();
        }
    }
}
