import * as React from 'react';
import { KycListView, IKycData } from './view';
import rootStore from 'app/stores';
import { IKycValidator } from '../../../api';

interface IState {
    data: IKycData;
    selectedIndex?: number;
}

export class KycList extends React.Component<any, IState> {
    // ToDo GUI-179: change any to never

    constructor(props: any) {
        super(props);
        this.state = {
            data: {},
            selectedIndex: undefined,
        };
    }

    protected getDataItem = async (
        password: string,
        validator: IKycValidator,
    ) => {
        const link = (await rootStore.mainStore.getKYCLink(
            password,
            rootStore.marketStore.marketAccountAddress,
            validator.id,
            validator.fee,
        )) as any;

        if (link) {
            return {
                kycLink: link as string,
            };
        } else {
            return {
                validationMessage:
                    rootStore.mainStore.serverValidation.password,
            };
        }
    };

    protected clearValidationMessage = () => {
        const data = this.state.data;
        Object.keys(data).forEach(function(id) {
            data[id].validationMessage = undefined;
        });
        this.setState({ data: { ...data } });
    };

    protected handleClickItem = (index: number) => {
        if (this.state.selectedIndex !== index) {
            this.clearValidationMessage();
        }
        this.setState({ selectedIndex: index });
    };

    protected handleCloseBottom = () => {
        this.setState({ selectedIndex: undefined });
        this.clearValidationMessage();
    };

    protected handleSubmitPasword = async (
        itemIndex: number,
        password: string,
    ) => {
        const list = rootStore.marketStore.validators;
        const target = list[itemIndex];
        const data = this.state.data;
        data[target.id] = await this.getDataItem(password, target);
        this.setState({ data });
    };

    public render() {
        return (
            <KycListView
                list={rootStore.marketStore.validators}
                data={this.state.data}
                selectedIndex={this.state.selectedIndex}
                onSubmitPassword={this.handleSubmitPasword}
                onClickItem={this.handleClickItem}
                onCloseBottom={this.handleCloseBottom}
            />
        );
    }
}
