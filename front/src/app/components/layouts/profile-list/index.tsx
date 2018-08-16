import * as React from 'react';
import { ProfileListView } from './view';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { withRootStore, Layout, IHasRootStore } from '../layout';
import { IProfileBrief } from 'app/entities/account';

interface IProps extends IHasRootStore {
    className?: string;
    onNavigate: (address: string) => void;
}

class ProfileListLayout extends Layout<IProps> {
    public handleRowClick = (record: IProfileBrief) => {
        this.props.onNavigate(record.address);
    };

    public handleChangeFilter = (key: string, value: any) => {
        this.rootStore.profileFilter.updateUserInput({
            [key]: value,
        });
    };

    public handleChangePage(page: number) {
        this.rootStore.profileList.updateUserInput({ page });
    }

    public handleTableChange = (pagination: any, filters: any, sorter: any) => {
        if (sorter.field) {
            this.rootStore.profileList.updateUserInput({
                sortBy: sorter.field,
                sortDesc: sorter.order === 'descend',
            });
        }
    };

    public render() {
        const listStore = this.rootStore.profileList;
        const filterStore = this.rootStore.profileFilter;
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

export const ProfileList = withRootStore(observer(ProfileListLayout));
