import * as React from 'react';
import { DealView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { ITogglerChangeParams } from '../../common/toggler';
import { EnumOrderSide } from 'app/api';
import { BalanceUtils } from 'app/components/common/balance-view/utils';
import { getPricePerHour } from 'app/components/common/price-per-hour/utils';
import { ChangeRequestDialog } from './sub/create-dialog/index';
import { IChangeParams } from '../../common/types';
import { ChangeRequestList } from './sub/change-request-list/index';

interface IProps {
    className?: string;
    onNavigateToDeals: () => void;
}

enum DealActions {
    finish = 'finish',
    createChangeRequest = 'createChangeRequest',
    editChangeRequest = 'editChangeRequest',
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

        if (dealDetailsStore.validation.password === '') {
            this.props.onNavigateToDeals();
        }
    };

    public componentDidMount() {
        this.resetInput();
        dealDetailsStore.startAutoUpdate();
    }

    public componentWillUnmount() {
        dealDetailsStore.stopAutoUpdate();
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

    private resetInput = () => {
        dealDetailsStore.resetUserInput();
    };

    public handleHideConfirmationPanel = () => {
        this.resetInput();
    };

    public handleChangeRequestDialogSubmit = async () => {
        await dealDetailsStore.actionChangeRequest();

        if (dealDetailsStore.validation.password === '') {
            this.handleChangeRequestDialogClose();
        }
    };

    public handleChangeRequestDialogClose = () => {
        dealDetailsStore.updateUserInput({
            action: DealActions.none,
            password: '',
        });
    };

    protected handleChangeRequestDialogChangeInput = (
        params: IChangeParams<string>,
    ) => {
        dealDetailsStore.updateUserInput({
            [params.name]: params.value,
        });
    };

    public handleChangeRequestCreate = () => {
        dealDetailsStore.resetUserInput();
        dealDetailsStore.updateUserInput({
            action: DealActions.createChangeRequest,
        });
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
            action: DealActions.editChangeRequest,
            password: '',
            changeRequestId: id,
        });
    };

    public handleChangeRequestAccept = (id: string) => {
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
            action: DealActions.acceptChangeRequest,
            password: '',
            changeRequestId: id,
        });
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
        } else {
            await dealDetailsStore.actionChangeRequest();
        }

        if (dealDetailsStore.validation.password === '') {
            this.handleHideConfirmationPanel();
        }
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
                ? EnumOrderSide.sell
                : EnumOrderSide.buy;

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
                    rootStore.dealDetailsStore.validation.password
                }
                isBlacklisted={rootStore.dealDetailsStore.isBlacklisted}
                onChangeCheckbox={this.handleChangeCheckbox}
                changeRequestList={
                    isOwner ? (
                        <ChangeRequestList
                            className="sonm-deal__change_request"
                            requests={deal.changeRequests || []}
                            dealParams={{
                                price: deal.price,
                                duration: deal.duration,
                            }}
                            mySide={mySide}
                            onCreateRequest={this.handleChangeRequestCreate}
                            onCancelRequest={this.handleChangeRequestCancel}
                            onChangeRequest={this.handleChangeRequestChange}
                            onRejectRequest={this.handleChangeRequestCancel}
                            onAcceptRequest={this.handleChangeRequestAccept}
                            onSubmit={this.handleChangeRequestSubmit}
                            onConfirmationCancel={
                                this.handleHideConfirmationPanel
                            }
                            showConfirmation={
                                dealDetailsStore.action ===
                                    DealActions.cancelChangeRequest ||
                                dealDetailsStore.action ===
                                    DealActions.acceptChangeRequest
                            }
                            validationMessage={
                                rootStore.dealDetailsStore.validation.password
                            }
                        />
                    ) : (
                        undefined
                    )
                }
                createChangeRequestDialog={
                    dealDetailsStore.action === DealActions.editChangeRequest ||
                    dealDetailsStore.action ===
                        DealActions.createChangeRequest ? (
                        <ChangeRequestDialog
                            onClose={this.handleChangeRequestDialogClose}
                            onSubmit={this.handleChangeRequestDialogSubmit}
                            onChangeInput={
                                this.handleChangeRequestDialogChangeInput
                            }
                            validationPassword={
                                rootStore.dealDetailsStore.validation.password
                            }
                            validationPrice={
                                rootStore.dealDetailsStore.validation.price
                            }
                            password={rootStore.dealDetailsStore.password}
                            newPrice={rootStore.dealDetailsStore.newPrice}
                            newDuration={rootStore.dealDetailsStore.newDuration}
                            showDuration={deal.duration > 0}
                        />
                    ) : (
                        undefined
                    )
                }
            />
        );
    }
}

export default Deal;
