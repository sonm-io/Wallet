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

export const WorkerList = withRootStore(
    observer(
        class extends React.Component<IProps, any> {
            // ToDo make stateless

            protected get rootStore() {
                return this.props.rootStore as RootStore;
            }

            public state = {
                showConfirm: false,
                slaveId: '',
            };

            public handleChangePage(page: number) {
                this.rootStore.workerListStore.updateUserInput({ page });
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
                const rootStore = this.rootStore;
                const link = await rootStore.mainStore.confirmWorker(
                    password,
                    rootStore.myProfilesStore.currentProfileAddress,
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
                this.rootStore.workerListStore.startAutoUpdate();
            }

            public componentWillUnmount() {
                this.rootStore.workerListStore.stopAutoUpdate();
            }

            public render() {
                const listStore = this.rootStore.workerListStore;
                const dataSource = toJS(listStore.records);

                return (
                    <WorkerListView
                        marketAccountAddress={
                            this.rootStore.myProfilesStore.currentProfileAddress
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
                            this.rootStore.mainStore.serverValidation.password
                        }
                    />
                );
            }
        },
    ),
);
