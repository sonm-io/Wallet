import * as React from 'react';
import * as cn from 'classnames';
import { Spinner } from '../spinner';
// import * as invariant from 'fbjs/lib/invariant';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    className?: string;
    visible?: boolean;
    children: any;
    white?: boolean;
    region?: boolean;
}

export class LoadMask extends React.PureComponent<IButtonProps> {
    protected parentPosition: string = '';

    protected rootRef: null | HTMLElement = null;

    public state = {
        errorText: '',
    };

    public componentDidMount() {
        if (
            this.props.region &&
            this.parentPosition !== 'relative' &&
            this.parentPosition !== 'absolute' &&
            this.rootRef !== null
        ) {
            this.setState({
                errorText:
                    'Load mask parent element position should be relative or absolute',
            });
        }
    }

    public processRootRef = (ref: HTMLElement | null) => {
        if (
            this.rootRef !== ref &&
            ref !== null &&
            ref.parentElement !== null
        ) {
            this.parentPosition =
                window.getComputedStyle(ref.parentElement).position || 'static';
        }
        this.rootRef = ref;
    };

    public render() {
        if (this.state.errorText !== '') {
            return <span style={{ color: 'red' }}>{this.state.errorText}</span>;
        }

        const { className, visible, children, white, region } = this.props;

        return [
            <div
                ref={this.processRootRef}
                className={cn(
                    className,
                    'sonm-load-mask',
                    region ? 'sonm-load-mask--region' : 'sonm-load-mask--full',
                    {
                        'sonm-load-mask--visible': visible,
                        'sonm-load-mask--white': white,
                    },
                )}
                key="lm"
            >
                <div className="sonm-load-mask__pale">
                    <Spinner className="sonm-load-mask__spinner" />
                </div>
            </div>,
            children,
        ];
    }
}

export default LoadMask;
