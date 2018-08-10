import * as React from 'react';
import * as cn from 'classnames';
import { Spinner } from '../spinner';

export interface IButtonProps extends React.ButtonHTMLAttributes<any> {
    className?: string;
    visible?: boolean;
    children: any;
    white?: boolean;
    region?: boolean;
}

export class LoadMask extends React.PureComponent<IButtonProps, never> {
    public processRootRef = (ref: HTMLElement | null) => {
        if (ref !== null) {
            if (
                this.props.region &&
                (ref.parentElement === null ||
                    window.getComputedStyle(ref.parentElement).position ===
                        'static')
            ) {
                throw new Error(
                    'Load mask parent element position should be relative or absolute',
                );
            }
        }
    };

    public render() {
        const { className, children, white, region, visible } = this.props;

        return [
            <div
                key="loadmask"
                ref={this.processRootRef}
                className={cn(className, 'sonm-load-mask', {
                    'sonm-load-mask--region': region,
                    'sonm-load-mask--hidden': !visible,
                    'sonm-load-mask--top': !region,
                })}
            >
                <div
                    className={cn('sonm-load-mask__pale', {
                        'sonm-load-mask__pale--white': white,
                    })}
                >
                    <Spinner
                        className={cn(
                            'sonm-load-mask__spinner',
                            region
                                ? 'sonm-load-mask__spinner--region-center'
                                : 'sonm-load-mask__spinner--screen-center',
                        )}
                    />
                </div>
            </div>,
            children,
        ];
    }
}

export default LoadMask;
