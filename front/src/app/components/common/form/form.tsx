import * as React from 'react';
import * as cn from 'classnames';

interface IFormProps extends React.FormHTMLAttributes<any> {
    className?: string;
    children: any;
    theme?: string;
}

export function Form(props: IFormProps) {
    const { className, theme, ...rest } = props;

    return <form
        className={cn(
            'sonm-form',
            className, {
                [`sonm-form--theme-${theme}`]: theme,
            },
        )}
        {...rest}
    >
        {props.children}
    </form>;
}

interface IFormRowProps {
    className?: string;
    children: any;
}

export function FormRow(props: IFormRowProps) {
    return <div className={cn('sonm-form__row', props.className)}>
        {props.children}
    </div>;
}

export enum JustifyStyle {
    Start =  'flex-start',
    End = 'flex-end',
    Center = 'center',
    SpaceBetween = 'space-between',
    SpaceAround = 'space-around',
}

interface IFormButtonsProps {
    className?: string;
    justify?: JustifyStyle;
    children: any;
}

export function FormButtons(props: IFormButtonsProps) {
    return <div className={cn('sonm-form__buttons', props.className)} style={{ justifyContent: props.justify }}>
        {props.children}
    </div>;
}

(FormButtons as any).defaultProps = {
    justify: JustifyStyle.Center,
};

interface IFormHeaderProps {
    className?: string;
    children: any;
}

export function FormHeader(props: IFormHeaderProps) {
    return <h3 className={cn('sonm-form__header', props.className)}>
        {props.children}
    </h3>;
}

export default Form;
