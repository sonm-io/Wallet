import * as React from 'react';
import { DealView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { ITogglerChangeParams } from '../../common/toggler';

interface IProps {
    className?: string;
    onNavigateToDeals: () => void;
}

interface IState {
    showConfirmationPanel: boolean;
    validationMessage: string;
}

@observer
export class Deal extends React.Component<IProps, IState> {
    public state = {
        showConfirmationPanel: false,
        validationMessage: '',
    };

    public handleFinishDeal = async (password: string) => {
        const dealDetailsStore = rootStore.dealDetailsStore;

        dealDetailsStore.updateUserInput({ password });
        await dealDetailsStore.submit();

        if (dealDetailsStore.validationPassword === '') {
            this.props.onNavigateToDeals();
        }
    };

    public handleChangeCheckbox = (params: ITogglerChangeParams) => {
        rootStore.dealDetailsStore.updateUserInput({
            isBlacklisted: params.value,
        });
    };

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
            deal.supplier.address.toLowerCase() === marketAccount ||
            deal.consumer.address.toLowerCase() === marketAccount;

        const propertyList = {
            id: deal.id,
            status: deal.status,
            blockedBalance: deal.blockedBalance,
            startTime: deal.startTime,
            endTime: deal.endTime,
            timeLeft: deal.timeLeft,
            supplierAddress: deal.supplier.address,
        };

        return (
            <DealView
                supplier={deal.supplier}
                consumer={deal.consumer}
                duration={deal.duration}
                price={deal.price}
                totalPayout={deal.totalPayout}
                benchmarkMap={deal.benchmarkMap}
                marketAccountAddress={marketAccount}
                showButtons={isOwner}
                propertyList={propertyList}
                onFinishDeal={this.handleFinishDeal}
                showConfirmationPanel={this.state.showConfirmationPanel}
                onShowConfirmationPanel={this.handleShowConfirmationPanel}
                onHideConfirmationPanel={this.handleHideConfirmationPanel}
                validationPassword={
                    rootStore.dealDetailsStore.validationPassword
                }
                isBlacklisted={rootStore.dealDetailsStore.isBlacklisted}
                onChangeCheckbox={this.handleChangeCheckbox}
            />
        );
    }
}

export default Deal;
