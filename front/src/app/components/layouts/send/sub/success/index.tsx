import * as React from 'react';
import * as cn from 'classnames';

interface IProps {
    className?: string;
    onClickHistory: () => void;
    onClickTransaction: () => void;
}

export class SendSuccess extends React.PureComponent<IProps, any> {

    protected onClickHistory = (event: any) => {
        console.log(event);
    }

    protected onClickTransaction = (event: any) => {
        console.log(event);
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={cn('sonm-send-success', className)}>
                <div className="sonm-send-success">
                    <h1 className="sonm-send-success__header">Transfer success</h1>
                    <div className="sonm-send-success__icons">
                        <div className="box sonm-send-success__icons__history" onClick={this.onClickHistory}/>
                        <div className="box sonm-send-success__icons__transaction" onClick={this.onClickTransaction}/>
                        <span className="box" onClick={this.onClickHistory}>Transaction history</span>
                        <span className="box" onClick={this.onClickTransaction}>New transaction</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SendSuccess;
