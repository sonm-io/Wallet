/* ToDo GUI-179: remove comment notes.
- [request providers list] from list store
- enter password in confirmation panel and press enter -> [rootStore.mainStore.getKYCLink]
- show link
*/
import * as React from 'react';
// import * as cn from 'classnames';
// import { IKycListItem } from './sub/kyc-list-item/types';
// import { KycListItem } from './sub/kyc-list-item';
import { KycListView } from './view';

const list = require('./sub/kyc-list-item/mock-data.js');

interface IState {}

export class KycList extends React.Component<never, IState> {
    protected handleSubmitPasword = (itemIndex: number, password: string) => {
        console.log('handleSubmitPasword');
        // rootStore.mainStore.getKYCLink
    };

    public render() {
        return (
            <KycListView
                list={list}
                onSubmitPasword={this.handleSubmitPasword}
            />
        );
    }
}
