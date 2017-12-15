import * as React from 'react';
import * as cn from 'classnames';
import * as moment from 'moment';

interface IDownloadProps {
    className?: string;
    data: string;
    address: string;
}

export class DownloadFile extends React.PureComponent<IDownloadProps, any> {

    private handleClick = () => {
        const { data, address } = this.props;

        const element = document.createElement('a');
        const file = new Blob([data], {type: 'text/json'});
        element.href = URL.createObjectURL(file);
        element.download = `UTC--${moment().format()}--${address}`;
        element.click();
    }

    public render() {
        const { className } = this.props;

        return (
            <div className={cn('sonm-deletable-item', className)}>
                <button className="sonm-download__icon" onClick={this.handleClick} />
            </div>
        );
    }
}

export default DownloadFile;
