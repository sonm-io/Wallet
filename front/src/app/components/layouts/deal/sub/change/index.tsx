import * as React from 'react';
import { DealChangeRequestView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';

interface IProps {
    className?: string;
    onNavigateToDeal: (id: string) => void;
}

interface IState {
    showConfirmationPanel: boolean;
    validationMessage: string;
}

@observer
export class DealChangeRequest extends React.Component<IProps, IState> {
    public state = {
        showConfirmationPanel: false,
        validationMessage: '',
    };

    public handleCreateChangeRequest = async (password: string) => {
        const dealDetailsStore = rootStore.dealDetailsStore;

        dealDetailsStore.updateUserInput({ password });
        await dealDetailsStore.createChangeRequest();

        if (dealDetailsStore.validationPassword === '') {
            this.props.onNavigateToDeal(rootStore.dealDetailsStore.deal.id);
        }
    };

    protected handleChangeFormInput(name: string, value: string) {
        rootStore.dealDetailsStore.updateUserInput({
            [name]: value,
        });
    }

    public handleShowConfirmationPanel = () => {
        this.setState({
            showConfirmationPanel: true,
        });
    };

    public handleHideConfirmationPanel = () => {
        this.setState({
            showConfirmationPanel: false,
        });

        rootStore.dealDetailsStore.updateUserInput({
            isBlacklisted: false,
        });
    };

    public render() {
        const deal = rootStore.dealDetailsStore.deal;
        const marketAccount = rootStore.marketStore.marketAccountAddress.toLowerCase();
        const isOwner =
            deal.supplier.address.toLowerCase() ===
                marketAccount.toLowerCase() ||
            deal.consumer.address.toLowerCase() === marketAccount.toLowerCase();

        const propertyList = {
            id: deal.id,
            status: deal.status,
            blockedBalance: deal.blockedBalance,
            startTime: deal.startTime,
            endTime: deal.endTime,
            timeLeft: deal.timeLeft,
            supplierAddress: deal.supplier.address,
            consumerAddress: deal.consumer.address,
        };

        return (
            <DealChangeRequestView
                duration={deal.duration}
                price={deal.price}
                totalPayout={deal.totalPayout}
                benchmarkMap={deal.benchmarkMap}
                marketAccountAddress={marketAccount}
                showButtons={isOwner}
                propertyList={propertyList}
                onCreateChangeRequest={this.handleCreateChangeRequest}
                showConfirmationPanel={this.state.showConfirmationPanel}
                onChangeFormInput={this.handleChangeFormInput}
                onShowConfirmationPanel={this.handleShowConfirmationPanel}
                onHideConfirmationPanel={this.handleHideConfirmationPanel}
                validationPassword={
                    rootStore.dealDetailsStore.validationPassword
                }
                newPrice={rootStore.dealDetailsStore.newPrice}
                newDuration={rootStore.dealDetailsStore.newDuration}
            />
        );
    }
}

export default DealChangeRequest;
