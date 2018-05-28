import * as React from 'react';
import * as cn from 'classnames';
import { IChengableProps, IFocusable } from '../types';

export interface ITextInputProps extends IChengableProps<string> {
    value?: string;
    type?: 'text' | 'password';
    name: string;
    autoFocus?: boolean;
    allowAutoComplete?: boolean;
    prefix?: string;
    onChangeDeprecated?: (event: any) => void;
    onChange?: (params: ITextChangeParams) => void;
    className?: string;
    readOnly?: boolean;
    placeholder?: string;
}

export interface ITextChangeParams {
    name: string;
    value: string;
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
            allowAutoComplete,
            prefix,
            className,
            name,
            placeholder,
            value,
        } = this.props;

        return (
            <div
                className={cn('sonm-input', className, {
                    'sonm-input--readonly': this.props.readOnly,
                })}
            >
                {prefix ? (
                    <span className="sonm-input__prefix">{prefix}</span>
                ) : null}
                <input
                    className="sonm-input__input"
                    ref={this.saveRef}
                    autoComplete={allowAutoComplete ? 'on' : 'off'}
                    name={name}
                    value={value}
                    onChange={this.handleChange}
                    placeholder={placeholder}
                />
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
