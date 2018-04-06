import * as React from 'react';
import * as cn from 'classnames';
import { Panel } from '../panel';
import { Dialog } from '../dialog';

const SHOW_MORE_BUTTON_HEIGHT = 30;

interface IProps {
    className?: string;
    title?: string;
    children: any;
    textShowMore?: string;
    onClickShowMore?: () => void;
    style?: any;
    showMoreContent: any;
    showMoreContentOnTop?: boolean;
    showMoreContentStepPx?: number;
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

        return (
            <Panel
                className={cn('sonm-exp-panel', p.className)}
                title={p.title}
                style={p.style}
            >
                {p.children && (
                    <div className="sonm-exp-panel__content-panel">
                        {p.children}
                    </div>
                )}
                <div
                    className={cn('sonm-exp-panel__content', {
                        'sonm-exp-panel__content--top': p.showMoreContentOnTop,
                    })}
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
                            {p.showMoreContent}
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
                        {p.showMoreContent}
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
        const outerHeight = outerRect.height - SHOW_MORE_BUTTON_HEIGHT;
        const innerHeight = innerRect.height;

        if (innerHeight > outerHeight) {
            const step = this.props.showMoreContentStepPx || 50;
            const clipperHeight = Math.floor(outerHeight / step) * step;
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
