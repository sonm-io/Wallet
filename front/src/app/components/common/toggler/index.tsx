import * as React from 'react';
import * as cn from 'classnames';

interface ITogglerChangeParams {
    name: string;
    value: boolean;
    stringValue: string;
}

interface ICssClasses {
    title: string;
    input: string;
    cradle: string;
    label: string;
}

interface ITogglerProps {
    className?: string;
    cssClasses?: ICssClasses;
    onChange?: (params: ITogglerChangeParams) => void;
    name: string;
    value: boolean;
    title: string;
    titleBefore?: boolean;
}

export class Toggler extends React.PureComponent<ITogglerProps, never> {
    public static defaultProps = {
        cssClasses: {
            input: 'sonm-toggler__input',
            label: 'sonm-toggler',
            cradle: 'sonm-toggler__cradle',
            title: 'sonm-toggler__title',
        },
    };

    public render() {
        const {
            className,
            name,
            value,
            title,
            titleBefore,
            cssClasses = Toggler.defaultProps.cssClasses,
        } = this.props;

        const content = [
            <input
                key="a"
                name={name}
                type="checkbox"
                className={cssClasses.input}
                checked={value}
                onChange={this.handleChange}
            />,
            <div className={cssClasses.cradle} key="b" />,
        ];

        if (title) {
            const titleBlock = (
                <div key="t" className={cssClasses.title}>
                    {title}
                </div>
            );

            if (titleBefore) {
                content.unshift(titleBlock);
            } else {
                content.push(titleBlock);
            }
        }

        return (
            <label className={cn(className, cssClasses.label)}>{content}</label>
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
