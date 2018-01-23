import * as React from 'react';
import * as cn from 'classnames';

interface IFormFieldProps {
    className?: string;
    warning?: string | string[];
    error?: string | string[];
    info?: string | string[];
    success?: string | string[];
    children: any;
    label: string;
}

const helpTextTypes: Array<keyof IFormFieldProps> = ['error', 'info', 'success'];

export class FormField extends React.PureComponent<IFormFieldProps, any> {
    public render() {
        let helpText = '';
        let helpTextType = '';

        helpTextTypes.some(x => {
            const raw = this.props[x];

            if (raw && raw.length) {
                helpText = Array.isArray(raw)
                    ? raw.join('; ')
                    : raw;
                helpTextType = x;
            }

            return Boolean(helpTextType);
        });

        let label = this.props.label.trim();
        if (!label.endsWith(':')) {
            label += ':';
        }

        return <label
            className={cn(
                'sonm-form-field',
                this.props.className,
                { [`sonm-form-field--${helpTextType}`]: Boolean(helpTextType) },
            )}
        >
            <div className="sonm-form-field__label">
                {label}
            </div>
            <div className="sonm-form-field__input">
                {this.props.children}
            </div>
            <div
                className="sonm-form-field__help"
            >
                {helpText}
            </div>
        </label>;
    }
}

export default FormField;
