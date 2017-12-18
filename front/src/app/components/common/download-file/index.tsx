import * as React from 'react';
import * as cn from 'classnames';

interface IDownloadProps {
    className?: string;
    data: string;
    fileName: string;
}

export class DownloadFile extends React.PureComponent<IDownloadProps, any> {

    private handleClick = (event: any) => {
        event.preventDefault();

        const { data, fileName } = this.props;

        const element = document.createElement('a');
        const file = new Blob([data], { type: 'text/json' });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        element.click();
    }

    public render() {
        const { className, fileName } = this.props;

        return (
            <a
                className={cn('sonm-download-file', className)}
                onClick={this.handleClick}
                href={`/download/${fileName}`}
            />
        );
    }
}

export default DownloadFile;
