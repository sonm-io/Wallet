import * as React from 'react';

export interface IProps {
    className?: string;
    title: string;
    text: string;
}

export class EmptyAccountList extends React.Component<IProps, any> {
    public render() {
        const {title, text} = this.props;

        return (
            <div>
                <h3>{title}</h3>
                {text}
            </div>
        );
    }
}

export default EmptyAccountList;
