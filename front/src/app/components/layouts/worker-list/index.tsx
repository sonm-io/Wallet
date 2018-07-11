import * as React from 'react';
import { WorkerListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

interface IProps {
    className?: string;
    filterByAddress?: string;
}

@observer
export class WorkerList extends React.Component<IProps, any> {
    public state = {
        showConfirm: false,
        slaveId: '',
    };

    public handleChangePage(page: number) {
        rootStore.workerListStore.updateUserInput({ page });
    }

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
        const link = await rootStore.mainStore.confirmWorker(
            password,
            rootStore.marketStore.marketAccountAddress,
            this.state.slaveId,
        );

        if (link) {
            this.handleCloseConfirm();
            rootStore.workerListStore.update();
        } else {
            this.setState({
                validationPassword:
                    rootStore.mainStore.serverValidation.password,
            });
        }
    };

    public componentDidMount() {
        rootStore.workerListStore.startAutoUpdate();
    }

    public componentWillUnmount() {
        rootStore.workerListStore.stopAutoUpdate();
    }

    public render() {
        const listStore = rootStore.workerListStore;
        const dataSource = toJS(listStore.records);

        return (
            <WorkerListView
                marketAccountAddress={
                    rootStore.marketStore.marketAccountAddress
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
                    rootStore.mainStore.serverValidation.password
                }
            />
        );
    }
}
