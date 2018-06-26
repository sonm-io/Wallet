import * as React from 'react';
import { KycListView, IKycData } from './view';
import rootStore from 'app/stores';
import { IKycValidator } from '../../../api';

interface IState {
    data: IKycData;
}

export class KycList extends React.Component<any, IState> {
    // ToDo GUI-179: change any to never

    constructor(props: any) {
        super(props);
        this.state = {
            data: {},
        };
    }

    protected getDataItem = async (
        password: string,
        validator: IKycValidator,
    ) => {
        const link = await rootStore.mainStore.getKYCLink(
            password,
            rootStore.marketStore.marketAccountAddress,
            validator.id,
            validator.fee,
        );
        if (link) {
            return {
                kycLink: 'asd',
            };
        } else {
            return {
                validationMessage:
                    rootStore.mainStore.serverValidation.password,
            };
        }
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
                onSubmitPassword={this.handleSubmitPasword}
                onClickItem={() => {}}
                onCloseBottom={() => {}}
            />
        );
    }
}
