import * as React from 'react';
import * as cn from 'classnames';
import { IChangeableProps, IFocusable } from '../types';

export interface ITextInputProps extends IChangeableProps<string> {
    autoFocus?: boolean;
    prefix?: string;
    onChangeDeprecated?: (event: any) => void;
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
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
            disabled,
        } = this.props;

        return (
            <div
                className={cn('sonm-input', className, {
                    'sonm-input--readonly': readOnly,
                })}
            >
                {prefix ? (
                    <button onClick={this.focus} className="sonm-input__prefix">
                        {prefix}
                    </button>
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
                    disabled={disabled}
                />
                {postfix ? postfix : null}
                <div className="sonm-input__underline" />
            </div>
        );
    }

    public focus = () => {
        if (this.inputNode) {
            this.inputNode.focus();
        }
    };
}
