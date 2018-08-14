import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from 'app/components/common/dropdown-input';
import * as invariant from 'fbjs/lib/invariant';
import { observer } from 'mobx-react';
import {
    Layout,
    withRootStore,
    IHasRootStore,
} from 'app/components/layouts/layout';
import { RootStore } from 'app/stores';

type TItem<T> = [
    string, // Title
    (() => void) | undefined, // Callback
    T[] | undefined // Children
];

export type TMenuItem = TItem<TItem<undefined>>;

export interface INavMenuDropdownProps extends IHasRootStore {
    items: Array<TMenuItem>;
    topMenuActiveItem: number;
    className?: string;
}

interface ISubItemProps extends IHasRootStore {
    onClick: () => void;
    onClose: () => void;
    isDisabled: boolean;
    title: string;
}

const SubMenuItem = withRootStore(
    class extends Layout<ISubItemProps> {
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
    },
);

export const NavMenuDropdown = withRootStore(
    observer(
        class NavMenuDropdownClass extends React.Component<
            INavMenuDropdownProps,
            any
        > {
            protected get rootStore() {
                return this.props.rootStore as RootStore;
            }

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
                return (
                    <div
                        data-display-id="nav-menu"
                        className={cn(this.props.className, 'sonm-nav-menu')}
                    >
                        {this.props.items.map((item: TMenuItem, index) => {
                            const [title, , children = Array.prototype] = item;
                            const isDisabled =
                                this.rootStore.ui.disabledMenuItems.indexOf(
                                    item[0],
                                ) > -1;

                            return (
                                <DropdownInput
                                    className={cn('sonm-nav-menu__item', {
                                        'sonm-nav-menu__item--disabled': isDisabled,
                                        'sonm-nav-menu__item--opened':
                                            this.state.opened === title,
                                        'sonm-nav-menu__item--active':
                                            this.props.topMenuActiveItem ===
                                            index,
                                    })}
                                    key={title}
                                    valueString={title}
                                    isExpanded={this.state.opened === title}
                                    onButtonClick={this.getBindedTopMenuHandler(
                                        title,
                                    )}
                                    onRequireClose={this.handleCloseTopMenu}
                                    disabled={isDisabled}
                                    dropdownCssClasses={
                                        NavMenuDropdownClass.dropdownCssClasses
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
                                                typeof checkSubDisabled ===
                                                'function'
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
                                                    onClick={
                                                        handleClick as () => void
                                                    }
                                                    onClose={
                                                        this.handleCloseTopMenu
                                                    }
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
        },
    ),
);

export default NavMenuDropdown;
