import * as React from 'react';
import * as cn from 'classnames';

interface INavMenuItems {
    title: string;
    url: string;
}

interface INavMenuProps {
    items: INavMenuItems[];
    url: string;
    onChange: (url: string) => void;
    className?: string;
    disabled?: string; // coma separated url list
}

export class NavMenu extends React.PureComponent<INavMenuProps, any> {
    protected handleClick = (event: any) => {
        event.preventDefault();

        const url = event.target.getAttribute('href');

        if (this.props.onChange && this.disabledUrlList.indexOf(url) === -1) {
             this.props.onChange(url);
        }
    }

    protected get disabledUrlList() {
        return this.props.disabled
            ? this.props.disabled.split(',')
            : Array.prototype;
    }

    public render() {
        const disabledUrlList = this.disabledUrlList;

        return (
            <ul
                className={cn(this.props.className, 'sonm-app-nav-menu')}
            >
                {this.props.items.map((item: INavMenuItems) =>
                    <li
                        className={cn(
                            'sonm-app-nav-menu__item', {
                            'sonm-app-nav-menu__item--active': this.props.url === item.url,
                            'sonm-app-nav-menu__item--disabled': disabledUrlList.indexOf(item.url) !== -1,
                        })}
                        key={item.title}
                    >
                        <a
                            className="sonm-app-nav-menu__item-link"
                            href={item.url}
                            onClick={this.handleClick}
                        >
                            {item.title}
                        </a>
                    </li>,
                )}
            </ul>
        );
    }
}

export default NavMenu;
