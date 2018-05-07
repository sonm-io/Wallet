import * as React from 'react';
import { ProfileListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { IProfileBrief } from 'app/api/types';

interface IProps {
    className?: string;
    onNavigate: (address: string) => void;
}

@observer
export class ProfileList extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
        rootStore.profileListStore.update();
    }

    public handleRowClick = (record: IProfileBrief) => {
        this.props.onNavigate(record.address);
    };

    public render() {
        const dataSource = toJS(rootStore.profileListStore.records);

        return (
            <ProfileListView
                className=""
                page={1}
                totalPage={3}
                limit={20}
                dataSource={dataSource}
                filter={ProfileListView.defaultFilter}
                onChangePage={Function.prototype as any}
                onChangeFilter={Function.prototype as any}
                onRowClick={this.handleRowClick}
            />
        );
    }
}
