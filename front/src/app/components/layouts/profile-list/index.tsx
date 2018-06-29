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

    public handleChangeFilter = (key: string, value: any) => {
        rootStore.profileFilterStore.updateUserInput({ [key]: value });
    };

    public handleChangePage(page: number) {
        rootStore.profileListStore.updateUserInput({ page });
    }

    public handleTableChange = (pagination: any, filters: any, sorter: any) => {
        if (sorter.field) {
            rootStore.profileListStore.updateUserInput({
                sortBy: sorter.field,
                sortDesc: sorter.order === 'descend',
            });
        }
    };

    public render() {
        const listStore = rootStore.profileListStore;
        const filterStore = rootStore.profileFilterStore;
        const dataSource = toJS(listStore.records);

        return (
            <ProfileListView
                page={listStore.page}
                total={toJS(listStore.total)}
                limit={listStore.limit}
                dataSource={dataSource}
                filter={ProfileListView.defaultFilter}
                onChangePage={this.handleChangePage}
                onChangeFilter={this.handleChangeFilter}
                onTableChange={this.handleTableChange}
                onClickRow={this.handleRowClick}
                filterCountry={filterStore.country}
                filterQuery={''}
                filterRole={filterStore.role}
                filterStatus={filterStore.status}
                filterMinDeals={filterStore.minDeals}
            />
        );
    }
}
