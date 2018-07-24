import * as React from 'react';
import * as cn from 'classnames';

interface IFormFieldProps {
    className?: string;
    warning?: string | string[];
    error?: string | string[];
    info?: string | string[];
    success?: string | string[];
    children: any;
    label?: string;
    fullWidth?: boolean;
    horizontal?: boolean;
    postfix?: string;
    /**
     * Use 'div' to not propagate click event to fields container.
     * Usefull in case multiple checkboxes in fields container.
     */
    tag?: 'label' | 'div';
}

const helpTextTypes: Array<keyof IFormFieldProps> = [
    'error',
    'info',
    'success',
];

export class FormField extends React.PureComponent<IFormFieldProps, any> {
    public render() {
        const p = this.props;
        let helpText = '';
        let helpTextType = '';

        helpTextTypes.some(x => {
            const raw = p[x];

            if (raw && raw.length) {
                helpText = Array.isArray(raw) ? raw.join('; ') : raw;
                helpTextType = x;
            }

            return Boolean(helpTextType);
        });

        let label;

        if (p.label) {
            label = p.label.trim();
            if (!label.endsWith(':') && p.horizontal !== true) {
                label += ':';
            }
        }

        const postfix = p.postfix ? (
            <div className="sonm-form-field__postfix">{p.postfix}</div>
        ) : null;

        const Tag = p.tag || 'label';

        return (
            <Tag
                className={cn('sonm-form-field', p.className, {
                    [`sonm-form-field--${helpTextType}`]: helpTextType,
                    'sonm-form-field--full-width': p.fullWidth,
                    'sonm-form-field--horizontal': p.horizontal,
                })}
            >
                <div
                    className={cn('sonm-form-field__label', {
                        'sonm-form-field__label--nowrap': p.horizontal !== true,
                    })}
                >
                    {label ? label : ''}
                </div>
                <div className="sonm-form-field__input">
                    {p.children}
                    {postfix}
                    <div className="sonm-form-field__help">{helpText}</div>
                </div>
            </Tag>
        );
    }
}

export default FormField;
