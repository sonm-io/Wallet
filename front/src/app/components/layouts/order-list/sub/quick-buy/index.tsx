import * as React from 'react';
import { QuickBuyView } from './view';
import { rootStore } from 'app/stores/';
import { observer } from 'mobx-react';

interface IProps {
    orderId: string;
    onNavigateBack: () => void;
}

@observer
export class QuickBuy extends React.Component<IProps, any> {
    public state = {
        password: '',
    };

    public handleSubmit = async () => {
        const orderId = this.props.orderId;
        const orderDetailsStore = rootStore.orderDetailsStore;

        orderDetailsStore.updateUserInput({ orderId });
        await orderDetailsStore.submit();

        if (orderDetailsStore.validationPassword === '') {
            this.props.onNavigateBack();
        }
    };

    public handleChangePassword(event: any) {
        rootStore.orderDetailsStore.updateUserInput({
            password: event.target.value,
        });
    }

    public render() {
        const validationPassword =
            rootStore.orderDetailsStore.validationPassword;
        const text = rootStore.orderDetailsStore.userInput.password;

        return (
            <QuickBuyView
                onChangePassword={this.handleChangePassword}
                validationPassword={validationPassword}
                password={text}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default QuickBuy;
