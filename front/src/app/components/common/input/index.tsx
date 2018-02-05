import * as React from 'react';
import * as cn from 'classnames';

interface IInputProps extends React.InputHTMLAttributes<any> {
}

interface IFocusable {
    focus: () => void;
}

export class Input extends React.Component<IInputProps, any> implements IFocusable {
    protected inputNode: IFocusable | null = null;

    protected saveRef = (ref: HTMLInputElement) => this.inputNode = ref;

    public render() {
        return <input {...this.props} className={cn('sonm-input', this.props.className)} />;
    }

    public focus() {
        if (this.inputNode) {
            this.inputNode.focus();
        }
    }
}
