import * as React from 'react';
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';
import { create } from 'ethereum-blockies';

export interface IProps extends AvatarProps {
    address?: string;
}

export class IdentIcon extends React.PureComponent<IProps, any> {
    public componentWillMount() {
        this.updateDataUrl(null, this.props);
    }

    public componentWillReceiveProps(next: IProps) {
        this.updateDataUrl(this.props, next);
    }

    private updateDataUrl(props: IProps | null, nextProps: IProps) {
        if (props === null || props.address !== nextProps.address) {
            const canvas = create({seed: nextProps.address});
            this.setState({
                dataUrl: canvas.toDataURL(),
            });
        }
    }

    public render() {
        return (
            <Avatar {...this.props} src={this.state.dataUrl}/>
        );
    }
}
