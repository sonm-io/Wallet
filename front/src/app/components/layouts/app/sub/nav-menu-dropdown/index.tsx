import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from '../../../../common/dropdown-input';

type TItem<T> = [string, string, T[] | undefined]; // Title, Path. children

type TMenuItem = TItem<TItem<undefined>>;

interface INavMenuProps {
    items: Array<TMenuItem>;
    url: string;
    onChange: (url: string) => void;
    className?: string;
    disabled?: string; // coma separated url list
}

export class NavMenuDropdown extends React.PureComponent<INavMenuProps, any> {
    public state = {
        opened: '',
    };

    protected get disabledUrlList() {
        return this.props.disabled
            ? this.props.disabled.split(',')
            : Array.prototype;
    }

    protected handleClickTopMenu = () => {};

    protected handleClickUrl = () => {};

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
        const disabledUrlList = this.disabledUrlList;

        return (
            <div className={cn(this.props.className, 'sonm-nav-menu')}>
                {this.props.items.map((item: TMenuItem) => {
                    const [title, path, children] = item;

                    return (
                        <DropdownInput
                            className={cn('sonm-nav-menu__top-item', {
                                'sonm-nav-menu__top-item--active':
                                    this.props.url === path,
                                'sonm-nav-menu__top-item--disabled':
                                    disabledUrlList.indexOf(path) !== -1,
                            })}
                            key={title}
                            valueString={title}
                            isExpanded={this.state.opened === title}
                            onButtonClick={this.getBindedTopMenuHandler(title)}
                            onRequireClose={this.handleCloseTopMenu}
                            dropdownCssClasses={{
                                root: '',
                                button: 'sonm-nav-menu__top-item-button',
                                popup: 'sonm-nav-menu__popup',
                                expanded: 'sonm-nav-menu--expanded',
                            }}
                        >
                            {children &&
                                children.map((subItem: TItem<undefined>) => {
                                    const [subTitle, subPath] = subItem;
                                    const href = `/${subPath}`;

                                    return (
                                        <button
                                            key={subPath}
                                            value={href}
                                            className="sonm-nav-menu__sub-item"
                                            onClick={this.handleClickUrl}
                                        >
                                            {subTitle}
                                        </button>
                                    );
                                })}
                        </DropdownInput>
                    );
                })}
            </div>
        );
    }
}

export default NavMenuDropdown;
