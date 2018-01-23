import * as React from 'react';
import * as cn from 'classnames';

interface IFormRowProps extends React.FormHTMLAttributes<any> {
    className?: string;
    children: any;
}

export class Form extends React.PureComponent<IFormRowProps, any> {
    public render() {
        const { className, ...rest } = this.props;

        return <div className={cn('sonm-form', className)} {...rest}>
            {this.props.children}
        </div>;
    }
}

interface IFormRowProps {
    className?: string;
    children: any;
}

export class FormRow extends React.PureComponent<IFormRowProps, any> {
    public render() {
        return <div className={cn('sonm-form__row', this.props.className)}>
            {this.props.children}
        </div>;
    }
}

export default Form;
