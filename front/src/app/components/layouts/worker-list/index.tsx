import * as React from 'react';
import { WorkerListView } from './view';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { withRootStore, IHasRootStore } from '../layout';
import { RootStore } from 'app/stores';

interface IProps extends IHasRootStore {
    className?: string;
    filterByAddress?: string;
}

class WorkerListLayout extends React.Component<IProps, any> {
    // ToDo make stateless

    protected get rootStore() {
        return this.props.rootStore as RootStore;
    }

    public state = {
        showConfirm: false,
        slaveId: '',
    };

    public handleChangePage = (page: number) => {
        this.rootStore.workerList.updateUserInput({ page });
    };

    protected handleClickConfirm = async (slaveId: string) => {
        this.setState({
            showConfirm: true,
            slaveId,
        });
    };

    protected handleCloseConfirm = () => {
        this.setState({
            showConfirm: false,
        });
    };

    protected handleSubmitConfirm = async (password: string) => {
        const rootStore = this.rootStore;
        const link = await rootStore.main.confirmWorker(
            password,
            rootStore.myProfiles.currentProfileAddress,
            this.state.slaveId,
        );

        if (link) {
            this.handleCloseConfirm();
            rootStore.workerList.update();
        } else {
            this.setState({
                validationPassword: rootStore.main.serverValidation.password,
            });
        }
    };

    public componentDidMount() {
        this.rootStore.workerList.startAutoUpdate();
    }

    public componentWillUnmount() {
        this.rootStore.workerList.stopAutoUpdate();
    }

    public render() {
        const listStore = this.rootStore.workerList;
        const dataSource = toJS(listStore.records);

        return (
            <WorkerListView
                marketAccountAddress={
                    this.rootStore.myProfiles.currentProfileAddress
                }
                page={listStore.page}
                total={toJS(listStore.total)}
                limit={listStore.limit}
                dataSource={dataSource}
                onChangePage={this.handleChangePage}
                onClickConfirm={this.handleClickConfirm}
                onCloseConfirm={this.handleCloseConfirm}
                onSubmitConfirm={this.handleSubmitConfirm}
                showConfirm={this.state.showConfirm}
                validationPassword={
                    this.rootStore.main.serverValidation.password
                }
            />
        );
    }
}

export const WorkerList = withRootStore(observer(WorkerListLayout));
