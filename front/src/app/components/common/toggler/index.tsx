import * as React from 'react';
import * as cn from 'classnames';

interface ITogglerChangeParams {
    name: string;
    value: boolean;
    stringValue: string;
}

interface ICssClasses {
    label: string;
    input: string;
    cradle: string;
}

interface ITogglerProps {
    className?: string;
    cssClasses?: ICssClasses;
    onChange?: (params: ITogglerChangeParams) => void;
    name: string;
    value: boolean;
    label: string;
}

export class Toggler extends React.PureComponent<ITogglerProps, never> {
    public static defaultProps = {
        cssClasses: {
            input: 'sonm-toggler__input',
            label: 'sonm-toggler',
            cradle: 'sonm-toggler__cradle',
        },
    };

    public render() {
        const {
            className,
            name,
            value,
            cssClasses = Toggler.defaultProps.cssClasses,
        } = this.props;

        return (
            <label className={cn(className, cssClasses.label)}>
                <input
                    name={name}
                    type="checkbox"
                    className={cssClasses.input}
                    checked={value}
                    onChange={this.handleChange}
                />
                <div className={cssClasses.cradle} />
            </label>
        );
    }

    protected handleChange = (event: any) => {
        const p = this.props;
        const value = event.target.checked;

        if (p.onChange !== undefined) {
            p.onChange({
                value,
                name: p.name,
                stringValue: value ? 'enable' : 'disable',
            });
        }
    };
}

export default Toggler;
