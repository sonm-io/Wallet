import * as React from 'react';
import { ProfileListView } from './view';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { injectRootStore, Layout, IHasRootStore } from '../layout';
import { IProfileBrief } from 'app/entities/account';

interface IProps extends IHasRootStore {
    className?: string;
    onNavigate: (address: string) => void;
}

@injectRootStore
@observer
export class ProfileList extends Layout<IProps> {
    public handleRowClick = (record: IProfileBrief) => {
        this.props.onNavigate(record.address);
    };

    public handleChangeFilter = (key: string, value: any) => {
        this.rootStore.profileFilterStore.updateUserInput({ [key]: value });
    };

    public handleChangePage(page: number) {
        this.rootStore.profileListStore.updateUserInput({ page });
    }

    public handleTableChange = (pagination: any, filters: any, sorter: any) => {
        if (sorter.field) {
            this.rootStore.profileListStore.updateUserInput({
                sortBy: sorter.field,
                sortDesc: sorter.order === 'descend',
            });
        }
    };

    public render() {
        const listStore = this.rootStore.profileListStore;
        const filterStore = this.rootStore.profileFilterStore;
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
