import * as React from 'react';
import * as cn from 'classnames';

interface IInputProps extends React.InputHTMLAttributes<any> {
    autoFocus?: boolean;
    allowAutoComplete?: boolean;
    prefix?: string;
}

interface IFocusable {
    focus: () => void;
}

export class Input extends React.Component<IInputProps, any>
    implements IFocusable {
    protected inputNode: IFocusable | null = null;

    protected saveRef = (ref: HTMLInputElement) => {
        if (this.props.autoFocus && !this.inputNode && ref !== null) {
            ref.focus();
        }
        this.inputNode = ref;
    };

    public render() {
        const {
            autoFocus,
            allowAutoComplete,
            prefix,
            className,
            ...rest
        } = this.props;
        const autoComplete = allowAutoComplete ? 'on' : 'off';

        return (
            <div
                style={undefined}
                className={cn('sonm-input', className, {
                    'sonm-input--readonly': this.props.readOnly,
                })}
            >
                {prefix ? (
                    <span className="sonm-input__prefix">{prefix}</span>
                ) : null}
                <input
                    {...rest}
                    style={undefined}
                    className="sonm-input__input"
                    ref={this.saveRef}
                    autoComplete={autoComplete}
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
