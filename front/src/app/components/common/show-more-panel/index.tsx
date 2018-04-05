import * as React from 'react';
import * as cn from 'classnames';
import { Panel } from '../panel';
import { Dialog } from '../dialog';

interface IProps {
    className?: string;
    title?: string;
    children: any;
    contentSizeStepPx?: number;
    textShowMore?: string;
    onClickShowMore?: () => void;
    style?: any;
}

export class ShowMorePanel extends React.Component<IProps, any> {
    public state = {
        isShowMoreVisible: true,
        isPopupVisible: false,
    };

    public static defaultProps = {
        textShowMore: 'Show more',
    };

    public handleClickShowMore = () => {
        this.setState(() => ({
            isPopupVisible: true,
        }));
    };

    public handleCloseDialog = () => {
        this.setState(() => ({
            isPopupVisible: false,
        }));
    };

    public render() {
        const s = this.state;
        const p = this.props;
        const childrenCount = React.Children.count(p.children);
        const hasTwoParts = childrenCount >= 2;
        const children = hasTwoParts
            ? React.Children.toArray(p.children)
            : p.children;

        return (
            <Panel
                className={cn('sonm-exp-panel', p.className)}
                title={p.title}
                style={p.style}
            >
                {hasTwoParts && (
                    <div className="sonm-exp-panel__content-top">
                        {children.slice(0, childrenCount - 1)}
                    </div>
                )}
                <div
                    className="sonm-exp-panel__content"
                    ref={this.processOuterRef}
                >
                    <div
                        className="sonm-exp-panel__content-clip"
                        ref={this.processClipperRef}
                    >
                        <div
                            className="sonm-exp-panel__content-size"
                            ref={this.processInnerRef}
                        >
                            {hasTwoParts
                                ? children[childrenCount - 1]
                                : children}
                        </div>
                    </div>
                    <a
                        ref={this.processShowRef}
                        className="sonm-exp-panel__show-more"
                        href="#show-more"
                        onClick={this.handleClickShowMore}
                    >
                        {p.textShowMore}
                    </a>
                </div>
                {s.isPopupVisible && (
                    <Dialog
                        className="sonm-exp-panel__modal"
                        onClickCross={this.handleCloseDialog}
                    >
                        {hasTwoParts ? children[childrenCount - 1] : children}
                    </Dialog>
                )}
            </Panel>
        );
    }

    public componentDidUpdate() {
        this.recalcHeight();
    }

    protected nodes: any = {};
    protected processRef(name: string, ref: HTMLDivElement | null) {
        if (ref === this.nodes[name]) {
            return;
        }
        return (this.nodes[name] = ref);
    }

    protected recalcHeight() {
        const outerRect = this.nodes.outer.getBoundingClientRect();
        const innerRect = this.nodes.inner.getBoundingClientRect();

        if (innerRect.height > outerRect.height) {
            const step = this.props.contentSizeStepPx || 50;
            const clipperHeight = Math.floor(outerRect.height / step) * step;
            this.nodes.clipper.style.height = `${clipperHeight}px`;
            this.nodes.show.style.visibility = 'visible';
        } else {
            this.nodes.show.style.visibility = 'hidden';
        }
    }

    protected processShowRef = this.processRef.bind(this, 'show');
    protected processClipperRef = this.processRef.bind(this, 'clipper');
    protected processInnerRef = this.processRef.bind(this, 'inner');
    protected processOuterRef = (ref: HTMLDivElement | null) => {
        if (this.processRef('outer', ref)) {
            this.recalcHeight();
        }
    };
}

export default ShowMorePanel;
