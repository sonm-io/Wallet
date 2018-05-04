import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from 'app/components/common/dropdown-input';

type TItem<T> = [string, string, T[] | undefined]; // Title, Path. children

export type TMenuItem = TItem<TItem<undefined>>;

export interface INavMenuDropdownProps {
    items: Array<TMenuItem>;
    topMenuActiveItem: string;
    onChange: (url: string) => void;
    className?: string;
}

export class NavMenuDropdown extends React.PureComponent<
    INavMenuDropdownProps,
    any
> {
    public state = {
        opened: '',
    };

    protected handleClickUrl = (event: any) => {
        const path = event.target.value;

        this.props.onChange(path);
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
            <div className={cn(this.props.className, 'sonm-nav-menu')}>
                {this.props.items.map((item: TMenuItem) => {
                    const [title, path, children] = item;

                    return (
                        <DropdownInput
                            className={cn('sonm-nav-menu__item', {
                                'sonm-nav-menu__item--opened':
                                    this.state.opened === title,
                                'sonm-nav-menu__item--active':
                                    this.props.topMenuActiveItem === path,
                            })}
                            key={title}
                            valueString={title}
                            isExpanded={this.state.opened === title}
                            onButtonClick={this.getBindedTopMenuHandler(title)}
                            onRequireClose={this.handleCloseTopMenu}
                            dropdownCssClasses={{
                                root: 'sonm-nav-menu-dropdown',
                                button: 'sonm-nav-menu-dropdown__button',
                                popup: 'sonm-nav-menu-dropdown__popup',
                                expanded: 'sonm-nav-menu-dropdown--expanded',
                            }}
                        >
                            <div className="sonm-nav-menu__popup">
                                {children &&
                                    children.map(
                                        (subItem: TItem<undefined>) => {
                                            const [subTitle, subPath] = subItem;

                                            return (
                                                <button
                                                    key={subTitle}
                                                    value={subPath}
                                                    type="button"
                                                    className="sonm-nav-menu__sub-item"
                                                    onClick={
                                                        this.handleClickUrl
                                                    }
                                                >
                                                    {subTitle}
                                                </button>
                                            );
                                        },
                                    )}
                            </div>
                        </DropdownInput>
                    );
                })}
            </div>
        );
    }
}

export default NavMenuDropdown;
