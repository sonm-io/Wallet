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
import { Balloon } from '../balloon';

export class DropdownInput extends React.Component<IDropdownInputProps, any> {
    public static readonly getDefaultCssClasses = (
        rootClassName: string,
    ): IDropdownCssClasses => ({
        root: `${rootClassName}`,
        expanded: `${rootClassName}--expanded`,
        button: `${rootClassName}__button`,
        popup: `${rootClassName}__popup`,
    });

    public static readonly defaultProps: IDropdownOptionalInputProps = {
        className: '',
        dropdownCssClasses: DropdownInput.getDefaultCssClasses(
            'dropdown-input',
        ),
        hasBalloon: false,
    };

    public static propTypes: TJsPropTypes<IDropdownAllProps> = {
        valueString: propTypes.node,
        isExpanded: propTypes.bool,
        onButtonClick: propTypes.func,
        onRequireClose: propTypes.func,
        children: propTypes.node,
        className: propTypes.string,
        hasBalloon: propTypes.bool,
        dropdownCssClasses: propTypes.shape({
            root: propTypes.string,
            button: propTypes.string,
            popup: propTypes.string,
        }),
    };

    protected handleBodyClick = (event: any) => {
        const children = this.rootNodeRef && this.rootNodeRef.children;
        if (
            children &&
            (children[0].contains(event.target) ||
                (children[1] && children[1].contains(event.target)))
        ) {
            return;
        }

        this.props.onRequireClose();
    };

    public focus() {
        this.rootNodeRef &&
            this.rootNodeRef.children &&
            this.rootNodeRef.children[0] &&
            (this.rootNodeRef.children[0] as HTMLButtonElement).focus();
    }

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

    public rootNodeRef?: HTMLDivElement;

    protected saveRef = (ref: HTMLDivElement | null) => {
        if (ref && ref !== this.rootNodeRef) {
            this.rootNodeRef = ref;
        }
    };

    protected getProps(): IDropdownAllProps {
        return this.props as IDropdownAllProps;
    }

    public render() {
        const props = this.getProps();
        const s = props.dropdownCssClasses;
        const Tag = props.hasBalloon ? Balloon : 'div';

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
                    <Tag className={s.popup}>{this.props.children}</Tag>
                ) : null}
            </div>
        );
    }
}

export default DropdownInput;

export * from './types';
