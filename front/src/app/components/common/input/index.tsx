import * as React from 'react';
import * as cn from 'classnames';

interface IInputProps extends React.InputHTMLAttributes<any> {
}

interface IFocusable {
    focus: () => void;
}

export class Input extends React.Component<IInputProps, any> implements IFocusable {
    protected static defaultProps = {
        mod: 'default',
    }

    protected inputNode: IFocusable | null = null;

    protected saveRef = (ref: HTMLInputElement) => this.inputNode = ref;

    public render() {
        return <div className={cn('sonm-input', this.props.className)}>
            <input {...this.props} className="sonm-input__input" />
            <div className="sonm-input__underline" />
        </div>;
    }

    public focus() {
        if (this.inputNode) {
            this.inputNode.focus();
        }
    }
}
