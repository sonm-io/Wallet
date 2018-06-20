import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from 'app/components/common/dropdown-input';

const h = React.createElement;

type TItem<T> = [
    string, // Title
    () => boolean, // idDisabled
    (() => void) | undefined, // Callback
    T[] | undefined // Children
];

export type TMenuItem = TItem<TItem<undefined>>;

export interface INavMenuDropdownProps {
    items: Array<TMenuItem>;
    topMenuActiveItem: number;
    className?: string;
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

    protected handleClickUrl = (event: any) => {
        const [index, childIndex] = event.target.value
            .split(',')
            .map((i: string) => Number(i)) as Array<number>;
        const item = this.props.items[index];
        const children = item[3];

        if (children !== undefined) {
            const childItem = children[childIndex];
            const cb = childItem[2];
            if (cb !== undefined) {
                cb();
            }
        }
        this.handleCloseTopMenu();
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
                {this.props.items.map((item: TMenuItem, index) => {
                    const [title, disabled, , children] = item;

                    return (
                        <DropdownInput
                            className={cn('sonm-nav-menu__item', {
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
                            disabled={disabled()}
                            dropdownCssClasses={
                                NavMenuDropdown.dropdownCssClasses
                            }
                        >
                            <div className="sonm-nav-menu__popup">
                                {children &&
                                    children.map(
                                        (
                                            subItem: TItem<undefined>,
                                            childIndex,
                                        ) => {
                                            const [
                                                subTitle,
                                                disableChild,
                                            ] = subItem;

                                            return h('button', {
                                                'data-display-id': `nav-menu-item-${subTitle.toLowerCase()}`,
                                                key: subTitle,
                                                value: `${index},${childIndex}`,
                                                type: 'button',
                                                className:
                                                    'sonm-nav-menu__sub-item',
                                                disabled: disableChild(),
                                                onClick: this.handleClickUrl,
                                                children: subTitle,
                                            });
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
