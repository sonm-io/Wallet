import * as React from 'react';
import { ProfileListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { IProfileBrief } from 'app/api/types';
import * as debounce from 'lodash/fp/debounce';

const debounce300 = debounce(300);

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

    public handleChangeFilter = debounce300((key: string, value: any) => {
        rootStore.profileFilterStore.updateUserInput({ [key]: value });
    });

    public handleChangePage(page: number) {
        rootStore.profileListStore.updateUserInput({ page });
    }

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
