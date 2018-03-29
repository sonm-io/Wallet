import * as React from 'react';
import * as cn from 'classnames';
import {
    IDropdownInputProps,
    IDropdownCssClasses,
    IDropdownOptionalInputProps,
    IDropdownAllProps,
} from './types';
import { TJsPropTypes } from '../types';
import * as propTypes from 'prop-types';

export class DropdownInput extends React.Component<IDropdownInputProps, any> {
    public static readonly getDefaultCssClasses = (
        rootClassName: string,
    ): IDropdownCssClasses => ({
        root: `${rootClassName}-input`,
        expanded: `${rootClassName}-input--expanded`,
        button: `${rootClassName}-input__button`,
        popup: `${rootClassName}-input__popup`,
    });

    public static readonly defaultProps: IDropdownOptionalInputProps = {
        className: '',
        dropdownCssClasses: DropdownInput.getDefaultCssClasses('dropdown'),
    };

    public static propTypes: TJsPropTypes<IDropdownAllProps> = {
        valueString: propTypes.string,
        isExpanded: propTypes.bool,
        onButtonClick: propTypes.func,
        onRequireClose: propTypes.func,
        children: propTypes.node,
        className: propTypes.string,
        dropdownCssClasses: propTypes.shape({
            root: propTypes.string,
            button: propTypes.string,
            popup: propTypes.string,
        }),
    };

    protected handleBodyClick = (event: any) => {
        const children = this.node && this.node.children;
        if (
            children &&
            (children[0].contains(event.target) ||
                (children[1] && children[1].contains(event.target)))
        ) {
            return;
        }

        this.props.onRequireClose();
    };

    public componentDidMount() {
        if (typeof window !== 'undefined') {
            window.document.body.addEventListener(
                'click',
                this.handleBodyClick,
            );
        }
    }

    public componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.document.body.removeEventListener(
                'click',
                this.handleBodyClick,
            );
        }
    }

    protected node?: HTMLDivElement;

    protected saveRef = (ref: HTMLDivElement | null) => {
        if (ref && ref !== this.node) {
            this.node = ref;
        }
    };

    protected getProps(): IDropdownAllProps {
        return this.props as IDropdownAllProps;
    }

    public render() {
        const props = this.getProps();
        const s = props.dropdownCssClasses;

        return (
            <div
                className={cn(this.props.className, s.root, {
                    [s.expanded]: this.props.isExpanded,
                })}
                ref={this.saveRef}
            >
                <button
                    type="button"
                    className={s.button}
                    onClick={this.props.onButtonClick}
                >
                    {this.props.valueString}
                </button>
                {this.props.isExpanded ? (
                    <div className={s.popup}>{this.props.children}</div>
                ) : null}
            </div>
        );
    }
}

export default DropdownInput;

export * from './types';
