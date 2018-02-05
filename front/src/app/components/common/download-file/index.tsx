import * as React from 'react';
import * as cn from 'classnames';

interface IDownloadProps {
    className?: string;
    data?: string;
    fileName: string;
    children: any;
    getData?: () => Promise<string>;
}

export class DownloadFile extends React.PureComponent<IDownloadProps, any> {
    public state = {
        pending: false,
        downloadUrl: '',
    }

    protected handleClick = async (event: any) => {
        if (this.state.pending) {
            event.preventDefault();
        }

        if (this.state.downloadUrl === '' && this.props.getData && this.linkNode) {
            this.setState({ pending: true });

            event.preventDefault();

            const data = await this.props.getData();
            const blob = new Blob([data], { type: 'application/json' });
            const downloadUrl = window.URL.createObjectURL(blob);

            this.setState({
                pending: false,
                downloadUrl,
            }, () => this.linkNode && this.linkNode.click());
        }
    }

    protected linkNode: HTMLAnchorElement | null = null;

    protected saveRef = (ref: HTMLAnchorElement | null) => {
        if (ref !== null) {
            this.linkNode = ref;
        }
    }

    public render() {
        const { className, fileName, data, getData, children } = this.props;

        if (!data && !getData) {
            throw new Error('props.data and props.getData are empty');
        }

        return (
            <a
                ref={this.saveRef}
                className={cn(
                    'sonm-download-file',
                    className, {
                    'sonm-download-file--pending': this.state.pending,
                })}
                href={data ? `data:text/plain;utf8,${data}` : this.state.downloadUrl}
                download={fileName}
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }
}

export default DownloadFile;
