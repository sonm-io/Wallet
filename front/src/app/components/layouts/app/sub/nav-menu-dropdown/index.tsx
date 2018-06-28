import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from 'app/components/common/dropdown-input';
import * as invariant from 'fbjs/lib/invariant';

type TItem<T> = [
    string, // Title
    (() => void) | undefined, // Callback
    T[] | undefined // Children
];

export type TMenuItem = TItem<TItem<undefined>>;

export interface INavMenuDropdownProps {
    items: Array<TMenuItem>;
    topMenuActiveItem: number;
    className?: string;
}

interface ISubItemProps {
    onClick: () => void;
    onClose: () => void;
    isDisabled: boolean;
    title: string;
}

class SubMenuItem extends React.Component<ISubItemProps, never> {
    protected handleClick = (event: any) => {
        event.preventDefault();

        if (!this.props.isDisabled) {
            this.props.onClick();
            this.props.onClose();
        }
    };

    public render() {
        const p = this.props;

        return (
            <li
                className={cn('sonm-nav-menu__sub-item', {
                    'sonm-nav-menu__sub-item--disabled': p.isDisabled,
                })}
            >
                <a
                    data-display-id="nav-menu-sub-item"
                    key={p.title}
                    className="sonm-nav-menu__sub-item-link"
                    href={p.title.toLowerCase()}
                    onClick={this.handleClick}
                >
                    {p.title}
                </a>
            </li>
        );
    }
}

export class NavMenuDropdown extends React.PureComponent<
    INavMenuDropdownProps,
    any
> {
    public state = {
        opened: '',
    };

    public static dropdownCssClasses = {
        root: 'sonm-nav-menu-dropdown',
        button: 'sonm-nav-menu-dropdown__button',
        popup: 'sonm-nav-menu-dropdown__popup',
        expanded: 'sonm-nav-menu-dropdown--expanded',
    };

    protected handleCloseTopMenu = () => {
        this.setState({ opened: '' });
    };

    protected bindedTopMenuHandlers: { [key: string]: () => void } = {};
    protected getBindedTopMenuHandler = (title: string) => {
        let result = this.bindedTopMenuHandlers[title];

        if (result === undefined) {
            result = this.bindedTopMenuHandlers[title] = () => {
                if (this.state.opened === title) {
                    this.setState({ opened: '' });
                } else {
                    this.setState({ opened: title });
                }
            };
        }

        return result;
    };

    public render() {
        const disabledItems: string[] = [];

        return (
            <div
                data-display-id="nav-menu"
                className={cn(this.props.className, 'sonm-nav-menu')}
            >
                {this.props.items.map((item: TMenuItem, index) => {
                    const [title, , children = Array.prototype] = item;
                    const isDisabled = disabledItems.indexOf(title) > 0;

                    return (
                        <DropdownInput
                            className={cn('sonm-nav-menu__item', {
                                'sonm-nav-menu__item--disabled': isDisabled,
                                'sonm-nav-menu__item--opened':
                                    this.state.opened === title,
                                'sonm-nav-menu__item--active':
                                    this.props.topMenuActiveItem === index,
                            })}
                            key={title}
                            valueString={title}
                            isExpanded={this.state.opened === title}
                            onButtonClick={this.getBindedTopMenuHandler(title)}
                            onRequireClose={this.handleCloseTopMenu}
                            disabled={isDisabled}
                            dropdownCssClasses={
                                NavMenuDropdown.dropdownCssClasses
                            }
                        >
                            <ul className="sonm-nav-menu__sub-item-list">
                                {children.map(subItem => {
                                    const [
                                        subItemTitle,
                                        handleClick,
                                        ,
                                        checkSubDisabled,
                                    ] = subItem;
                                    const isSubDisabled: boolean =
                                        typeof checkSubDisabled === 'function'
                                            ? checkSubDisabled()
                                            : false;

                                    invariant(
                                        handleClick !== undefined,
                                        'There is no handler for menu item %s',
                                        subItemTitle,
                                    );

                                    return (
                                        <SubMenuItem
                                            key={subItemTitle}
                                            title={subItemTitle}
                                            isDisabled={isSubDisabled}
                                            onClick={handleClick as () => void}
                                            onClose={this.handleCloseTopMenu}
                                        />
                                    );
                                })}
                            </ul>
                        </DropdownInput>
                    );
                })}
            </div>
        );
    }
}

export default NavMenuDropdown;
