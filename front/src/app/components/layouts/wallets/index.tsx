import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import * as api from 'app/api';

interface IProps {
    className?: string;
}

@inject('Store')
@observer
export class Wallets extends React.Component<IProps, any> {

    public render() {
        const {
            className,
        } = this.props;

        api.methods.ping().then (async (response: api.IResponse) => {
            //console.log(response);

            await api.methods.setSecretKey('my secret key');

            const json = '{"address":"88057f14236687831e1fd205e8efb9e45166fe72","crypto":{"cipher":"aes-128-ctr","ciphertext":"c5ba5234a2ee63ba3d6227ec76badc1c1b90d3cb89c67e6b3838b5ea151a871f","cipherparams":{"iv":"c0bba37aabca014fb2e167d950dda52e"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"4774e694dc2f374e5a1e78dba432a6af172f3cc58cf4283fa3e6b1d70a1ec1d5"},"mac":"7e91f97c19321c996c3fab95f52e35cd56172ac1de224bc224446ea0a8e33179"},"id":"c9356318-8835-413c-932e-4f9e3ad472f2","version":3}';
            const pass = '11111111';

            console.log(await api.methods.addAccount(json, pass, 'Wallet 1'));

            console.log(await api.methods.removeAccount('88057f14236687831e1fd205e8efb9e45166fe72'));
            console.log(await api.methods.renameAccount('88057f14236687831e1fd205e8efb9e45166fe72', 'Wallet 3'));

            console.log(await await api.methods.getCurrencyList());

            console.log(await api.methods.getAccountList());

            console.log(await api.methods.getGasPrice());

            console.log(await api.methods.getTransactionList());
            console.log(await api.methods.getTransactionList({}, 1, 1));

            console.log(await api.methods.send('0x88057f14236687831e1fd205e8efb9e45166fe72', '0xfd0c80ba15cbf19770319e5e76ae05012314608f', '2', '0x', '', '', '11111111'));
            console.log(await api.methods.send('0x88057f14236687831e1fd205e8efb9e45166fe72', '0xfd0c80ba15cbf19770319e5e76ae05012314608f', '2', '0x225b929916daadd5044d5934936313001f55d8f0', '', '', '11111111'));

            console.log(await api.methods.getTransactionList());

            // const res2 = ;
            // console.log(res2);

            // const res2 = ;
            // console.log(res2);

            // const res3 = await api.methods.renameAccount('88057f14236687831e1fd205e8efb9e45166fe72', 'Wallet 2');
            // console.log(res3);

            // const res4 = await api.methods.getAccountList();
            // console.log(res4);

            // const res5 = await api.methods.removeAccount('88057f14236687831e1fd205e8efb9e45166fe72');
            // console.log(res5);
            // const response1 = await api.methods.setSecretKey('my secret key');
            // console.log(response1);
            //
            // const response2 = await api.methods.getAccountList();
            // console.log(response2);
        });

        return (
            <div className={cn('sonm-send', className)}>
                history
            </div>
        );
    }
}