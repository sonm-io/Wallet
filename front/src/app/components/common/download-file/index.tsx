import * as React from 'react';
import * as cn from 'classnames';

interface IDownloadProps {
    className?: string;
    data: string;
    fileName: string;
}

export class DownloadFile extends React.PureComponent<IDownloadProps, any> {
    public render() {
        const { className, fileName, data } = this.props;

        return (
            <a
                className={cn('sonm-download-file', className)}
                href={`data:text/plain;utf8,${data}`}
                download={fileName}
            />
        );
    }
}

export default DownloadFile;
