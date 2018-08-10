import * as React from 'react';
import { DealView } from './view';
import { observer } from 'mobx-react';
import { ITogglerChangeParams } from '../../common/toggler';
import { injectRootStore, IHasRootStore, Layout } from '../layout';
import { EnumOrderSide } from 'app/api';
import { BalanceUtils } from 'app/components/common/balance-view/utils';
import { getPricePerHour } from 'app/components/common/price-per-hour/utils';
import { IChangeParams } from '../../common/types';
import { ChangeRequestList } from './sub/change-request-list/index';
import { DealActions } from './types';

interface IProps extends IHasRootStore {
    className?: string;
    onNavigateToDeals: () => void;
}

@injectRootStore
@observer
export class Deal extends Layout<IProps> {
    protected get dealDetailsStore() {
        return this.rootStore.dealDetailsStore;
    }

    public componentDidMount() {
        this.resetInput();
        this.dealDetailsStore.startAutoUpdate();
    }

    public componentWillUnmount() {
        this.dealDetailsStore.stopAutoUpdate();
    }

    public handleConfirmationDialogHide = () => {
        this.resetInput();
    };

    public handleChangeCheckbox = (params: ITogglerChangeParams) => {
        this.dealDetailsStore.updateUserInput({
            isBlacklisted: params.value,
        });
    };

    public handleFinishDealShow = () => {
        this.dealDetailsStore.updateUserInput({
            action: DealActions.finish,
        });
    };

    private resetInput = () => {
        this.dealDetailsStore.resetUserInput();
    };

    protected handleConfirmationDialogChangeInput = (
        params: IChangeParams<string>,
    ) => {
        this.dealDetailsStore.updateUserInput({
            [params.name]: params.value,
        });
    };

    public handleChangeRequestCreate = () => {
        this.dealDetailsStore.resetUserInput();
        this.dealDetailsStore.updateUserInput({
            action: DealActions.createChangeRequest,
        });
    };

    public handleChangeRequestEdit = (id: string) => {
        const changeRequest =
            this.dealDetailsStore.deal.changeRequests &&
            this.dealDetailsStore.deal.changeRequests.find(
                (item: any) => item.id === id,
            );

        this.dealDetailsStore.updateUserInput({
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
            this.dealDetailsStore.deal.changeRequests &&
            this.dealDetailsStore.deal.changeRequests.find(
                (item: any) => item.id === id,
            );

        this.dealDetailsStore.updateUserInput({
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
        this.dealDetailsStore.updateUserInput({
            action: DealActions.cancelChangeRequest,
            changeRequestId: id,
        });
    };

    public handleChangeRequestReject = (id: string) => {
        this.dealDetailsStore.updateUserInput({
            action: DealActions.rejectChangeRequest,
            changeRequestId: id,
        });
    };

    public handleConfirmationDialogSubmit = async () => {
        const dealDetailsStore = this.dealDetailsStore;
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
        const dealDetailsStore = this.dealDetailsStore;
        const deal = dealDetailsStore.deal;
        const marketAccount = this.rootStore.myProfilesStore.currentProfileAddress.toLowerCase();
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
