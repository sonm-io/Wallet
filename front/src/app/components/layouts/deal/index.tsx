import * as React from 'react';
import { DealView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { ITogglerChangeParams } from '../../common/toggler';
import { EnumOrderSide } from 'app/api';
import { BalanceUtils } from 'app/components/common/balance-view/utils';
import { getPricePerHour } from 'app/components/common/price-per-hour/utils';

interface IProps {
    className?: string;
    onNavigateToDeals: () => void;
    onNavigateToDealChangeRequest: (id: string) => void;
}

enum DealActions {
    finish = 'finish',
    changeRequest = 'changeRequest',
    cancelChangeRequest = 'cancelChangeRequest',
    acceptChangeRequest = 'acceptChangeRequest',
    none = '',
}

const dealDetailsStore = rootStore.dealDetailsStore;

@observer
export class Deal extends React.Component<IProps, never> {
    public handleFinishDeal = async (password: string) => {
        dealDetailsStore.updateUserInput({ password });
        await dealDetailsStore.finish();

        if (dealDetailsStore.validationPassword === '') {
            this.props.onNavigateToDeals();
        }
    };

    public componentDidMount() {
        dealDetailsStore.update();
    }

    public handleChangeCheckbox = (params: ITogglerChangeParams) => {
        dealDetailsStore.updateUserInput({
            isBlacklisted: params.value,
        });
    };

    public handleShowConfirmationPanel = () => {
        dealDetailsStore.updateUserInput({
            action: DealActions.finish,
        });
    };

    public handleHideConfirmationPanel = () => {
        dealDetailsStore.updateUserInput({
            action: DealActions.none,
            isBlacklisted: false,
        });
    };

    public handleChangeRequestCreate = () => {
        dealDetailsStore.updateUserInput({
            newPrice: '',
            newDuration: '',
        });

        this.props.onNavigateToDealChangeRequest(dealDetailsStore.deal.id);
    };

    public handleChangeRequestChange = (id: string) => {
        const changeRequest =
            dealDetailsStore.deal.changeRequests &&
            dealDetailsStore.deal.changeRequests.find(
                (item: any) => item.id === id,
            );

        dealDetailsStore.updateUserInput({
            newPrice:
                changeRequest && changeRequest.price
                    ? BalanceUtils.formatBalance(
                          getPricePerHour(changeRequest.price),
                          4,
                          18,
                          true,
                      )
                    : '',
            newDuration: (changeRequest && changeRequest.duration) || '',
        });

        this.props.onNavigateToDealChangeRequest(dealDetailsStore.deal.id);
    };

    public handleChangeRequestCancel = (id: string) => {
        dealDetailsStore.updateUserInput({
            action: DealActions.cancelChangeRequest,
            changeRequestId: id,
        });
    };

    public handleChangeRequestSubmit = async (password: string) => {
        dealDetailsStore.updateUserInput({ password });

        if (dealDetailsStore.action === DealActions.cancelChangeRequest) {
            await dealDetailsStore.cancelChangeRequest();
        } else if (
            dealDetailsStore.action === DealActions.acceptChangeRequest
        ) {
            await dealDetailsStore.createChangeRequest();
        }

        dealDetailsStore.update();
        this.handleHideConfirmationPanel();
    };

    public render() {
        const deal = dealDetailsStore.deal;
        const marketAccount = rootStore.marketStore.marketAccountAddress.toLowerCase();
        const isOwner =
            deal.supplier.address.toLowerCase() ===
                marketAccount.toLowerCase() ||
            deal.consumer.address.toLowerCase() === marketAccount.toLowerCase();
        const mySide =
            deal.supplier.address.toLowerCase() === marketAccount.toLowerCase()
                ? EnumOrderSide.ask
                : EnumOrderSide.bid;

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
            <DealView
                supplier={deal.supplier}
                consumer={deal.consumer}
                duration={deal.duration}
                price={deal.price}
                totalPayout={deal.totalPayout}
                changeRequests={deal.changeRequests}
                benchmarkMap={deal.benchmarkMap}
                marketAccountAddress={marketAccount}
                showButtons={isOwner}
                propertyList={propertyList}
                onFinishDeal={this.handleFinishDeal}
                onShowConfirmationPanel={this.handleShowConfirmationPanel}
                onHideConfirmationPanel={this.handleHideConfirmationPanel}
                showConfirmationPanel={
                    dealDetailsStore.action === DealActions.finish
                }
                validationPassword={
                    rootStore.dealDetailsStore.validationPassword
                }
                isBlacklisted={rootStore.dealDetailsStore.isBlacklisted}
                onChangeCheckbox={this.handleChangeCheckbox}
                mySide={mySide}
                changeRequestShowConfirmationPanel={
                    dealDetailsStore.action !== DealActions.none &&
                    dealDetailsStore.action !== DealActions.finish
                }
                onChangeRequestCreate={this.handleChangeRequestCreate}
                onChangeRequestChange={this.handleChangeRequestChange}
                onChangeRequestCancel={this.handleChangeRequestCancel}
                onChangeRequestReject={this.handleChangeRequestCancel}
                onChangeRequestAccept={this.handleChangeRequestCancel}
                onChangeRequestSubmit={this.handleChangeRequestSubmit}
                onChangeRequestConfirmationCancel={
                    this.handleHideConfirmationPanel
                }
            />
        );
    }
}

export default Deal;
