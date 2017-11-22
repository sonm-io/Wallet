import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import * as api from 'app/api';

interface IProps {
    className?: string;
    children?: any;
}

@inject('Store')
@observer
export class Wallets extends React.Component<IProps, any> {
    public render() {

        api.methods.ping().then ((response: api.IResponse) => {
            console.log(response);
        });

        //const json1 = JSON.parse('{"address":"88057f14236687831e1fd205e8efb9e45166fe72","crypto":{"cipher":"aes-128-ctr","ciphertext":"c5ba5234a2ee63ba3d6227ec76badc1c1b90d3cb89c67e6b3838b5ea151a871f","cipherparams":{"iv":"c0bba37aabca014fb2e167d950dda52e"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"4774e694dc2f374e5a1e78dba432a6af172f3cc58cf4283fa3e6b1d70a1ec1d5"},"mac":"7e91f97c19321c996c3fab95f52e35cd56172ac1de224bc224446ea0a8e33179"},"id":"c9356318-8835-413c-932e-4f9e3ad472f2","version":3}');
        //api.methods.addAccount(json1, '11111111', 'Wallet 1');

        //
        // const json2 = JSON.parse('{"address":"fd0c80ba15cbf19770319e5e76ae05012314608f","crypto":{"cipher":"aes-128-ctr","ciphertext":"83b9ea7c8b7f45d4d83704483a666d33b793c18a722557a1af0ea3dd84fd0e64","cipherparams":{"iv":"132e609bb81d9fff9380f828d44df738"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"18fbd1950ec1cfcd5564624152b66c09ce03df7b7b3136f019f746f12de8e8f9"},"mac":"b76158d4109241a4fd5752b06356de52152952cda78382d0cbac41650d58d64c"},"id":"d5c89177-f7c6-4da0-ac20-20b6d5f3dae1","version":3}');
        // api.methods.addAccount(json2, 'qazwsxedc', 'Wallet 2').then ((response: api.IAccountCheckResponse) => {
        //     console.log(response);
        // });

        //api.methods.renameAccount("fd0c80ba15cbf19770319e5e76ae05012314608f", 'Wallet 3');

        //api.methods.removeAccount('fd0c80ba15cbf19770319e5e76ae05012314608f');

        // api.methods.checkAccount(json, '11111111').then ((response: api.IResponse) => {
        //     console.log(response);
        // });

        api.methods.getAccountList().then (async (response: api.IAccountInfo[]) => {
            console.log(response);

            const currency = await api.methods.getCurrencyList();
            console.log(currency);

            const gasPrice = await api.methods.getGasPrice();
            console.log(gasPrice);

            const t1 = await api.methods.getTransactionList();
            console.log(t1);
            console.log('111111');

            //
            const t2 = await api.methods.getTransactionList({
                currency: '0x225b929916daadd5044d5934936313001f55d8f0'
            });
            console.log(t2);
            console.log('222222');

            //const res = await api.methods.send('88057f14236687831e1fd205e8efb9e45166fe72', 'fd0c80ba15cbf19770319e5e76ae05012314608f', '2', '0x', '0', '0', '11111111');
            //console.log(res);

            // api.methods.send('88057f14236687831e1fd205e8efb9e45166fe72', 'fd0c80ba15cbf19770319e5e76ae05012314608f', '2', '0x225b929916daadd5044d5934936313001f55d8f0', '0', '0', '11111111').catch ( err => {
            //     console.log(err);
            // }).then( res => {
            //     console.log(res);
            // });
            //console.log(res);
        });

        //
        // api.methods.getCurrencyList().then ((response: api.ICurrencyInfo[]) => {
        //     console.log(response);
        // });



        //

        // api.methods.getAccountList().then ((response: api.IAccountInfo[]) => {
        //     console.log(response);
        // });

        // api.methods.checkAccount(json, '1111111').then ((response: api.IResponse) => {
        //     console.log(response);
        // });
        //
        // api.methods.getBalance('88057f14236687831e1fd205e8efb9e45166fe72').then ((response: api.IResponse) => {
        //     console.log(response);
        // });

        const {
            className,
            children,
        } = this.props;

        return (
            <div className={cn('sonm-send', className)}>
                wallets
                {children}
            </div>
        );
    }
}
