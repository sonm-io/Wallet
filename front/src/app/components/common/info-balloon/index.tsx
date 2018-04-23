import * as React from 'react';
import * as cn from 'classnames';
import { Balloon } from '../balloon';

interface ITooltip {
    children: React.ReactNode;
    className: string;
}

export class InfoBalloon extends React.Component<ITooltip, any> {
    public state = {
        expanded: false,
    };

    protected handleBodyClick = (event: any) => {
        const node = this.node;
        if (node && !node.contains(event.target)) {
            this.setState({
                expanded: false,
            });
        }
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

    protected handleClickInfo = () => {
        this.setState({
            expanded: !this.state.expanded,
        });
    };

    public render() {
        const p = this.props;

        return (
            <div
                onClick={this.handleClickInfo}
                className={cn('sonm-info', p.className)}
                ref={this.saveRef}
            >
                {this.state.expanded ? (
                    <Balloon position="bottom" className="sonm-info__balloon">
                        {p.children}
                    </Balloon>
                ) : null}
            </div>
        );
    }
}

export default InfoBalloon;
