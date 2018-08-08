import * as React from 'react';
import { DealView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { ITogglerChangeParams } from '../../common/toggler';
import { EnumOrderSide } from 'app/api';
import { BalanceUtils } from 'app/components/common/balance-view/utils';
import { getPricePerHour } from 'app/components/common/price-per-hour/utils';
import { IChangeParams } from '../../common/types';
import { ChangeRequestList } from './sub/change-request-list/index';
import { DealActions } from './types';

interface IProps {
    className?: string;
    onNavigateToDeals: () => void;
}

const dealDetailsStore = rootStore.dealDetailsStore;

@observer
export class Deal extends React.Component<IProps, never> {
    public componentDidMount() {
        this.resetInput();
        dealDetailsStore.startAutoUpdate();
    }

    public componentWillUnmount() {
        dealDetailsStore.stopAutoUpdate();
    }

    public handleConfirmationDialogHide = () => {
        this.resetInput();
    };

    public handleChangeCheckbox = (params: ITogglerChangeParams) => {
        dealDetailsStore.updateUserInput({
            isBlacklisted: params.value,
        });
    };

    public handleFinishDealShow = () => {
        dealDetailsStore.updateUserInput({
            action: DealActions.finish,
        });
    };

    private resetInput = () => {
        dealDetailsStore.resetUserInput();
    };

    protected handleConfirmationDialogChangeInput = (
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

    public handleChangeRequestEdit = (id: string) => {
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

    public handleChangeRequestReject = (id: string) => {
        dealDetailsStore.updateUserInput({
            action: DealActions.rejectChangeRequest,
            changeRequestId: id,
        });
    };

    public handleConfirmationDialogSubmit = async () => {
        if (dealDetailsStore.action === DealActions.cancelChangeRequest) {
            await dealDetailsStore.cancelChangeRequest();
        } else if (dealDetailsStore.action === DealActions.finish) {
            await dealDetailsStore.finish();
        } else {
            await dealDetailsStore.actionChangeRequest();
        }

        if (dealDetailsStore.validation.password === '') {
            if (dealDetailsStore.action === DealActions.finish) {
                this.props.onNavigateToDeals();
            }

            this.handleConfirmationDialogHide();
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
                onFinishDealClick={this.handleFinishDealShow}
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
                            onChangeRequest={this.handleChangeRequestEdit}
                            onRejectRequest={this.handleChangeRequestReject}
                            onAcceptRequest={this.handleChangeRequestAccept}
                        />
                    ) : (
                        undefined
                    )
                }
                confirmationDialogAction={dealDetailsStore.action}
                confirmationDialogIsBlacklisted={dealDetailsStore.isBlacklisted}
                confirmationDialogPassword={dealDetailsStore.password}
                confirmationDialogPrice={dealDetailsStore.newPrice}
                confirmationDialogValidationPassword={
                    dealDetailsStore.validation.password
                }
                confirmationDialogValidationPrice={
                    dealDetailsStore.validation.price
                }
                confirmationDialogOnCheckboxChange={this.handleChangeCheckbox}
                confirmationDialogOnSubmit={this.handleConfirmationDialogSubmit}
                confirmationDialogOnCancel={this.handleConfirmationDialogHide}
                confirmationDialogOnClose={this.handleConfirmationDialogHide}
                confirmationDialogOnChangePassword={
                    this.handleConfirmationDialogChangeInput
                }
                confirmationDialogOnChangeInput={
                    this.handleConfirmationDialogChangeInput
                }
                confirmationDialogIsFormValid={dealDetailsStore.isFormValid}
            />
        );
    }
}
