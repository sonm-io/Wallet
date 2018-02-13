import * as React from 'react';
import * as cn from 'classnames';

interface IInputProps extends React.InputHTMLAttributes<any> {
    autoFocus?: boolean;
    allowAutoComplete?: boolean;
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
        const { autoFocus, className, allowAutoComplete, ...rest } = this.props;
        const autoComplete = allowAutoComplete ? 'on' : 'off';

        return (
            <div className={cn('sonm-input', className)}>
                <input
                    {...rest}
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
