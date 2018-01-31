import * as React from 'react';
import * as cn from 'classnames';

interface IDownloadProps {
    className?: string;
    data: string;
    fileName: string;
    children: any;
}

export class DownloadFile extends React.PureComponent<IDownloadProps, any> {
    public render() {
        const { className, fileName, data, children } = this.props;

        return (
            <a
                className={cn('sonm-download-file', className)}
                href={`data:text/plain;utf8,${data}`}
                download={fileName}
            >
                {children}
            </a>
        );
    }
}

export default DownloadFile;
