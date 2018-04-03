import * as React from 'react';
import { ProfileView } from './view';

interface IProps {
    className?: string;
}

const returnFirstArg = (...as: any[]) => String(as[0]);
const p = {
    getUiText: returnFirstArg,
    definitionList: [
        {
            label: 'Phone number',
            value: '+7 78 3782 23 23',
        },
        {
            label: 'E-mail',
            value: 'qwer@qwer.ti',
        },
        {
            label: 'Website',
            value: 'qwerfgb.df',
        },
    ],
    certificates: [],
    description:
        'description description description description description description description description',
    consumerDeals: '12',
    consumerAvgTime: '23',
    consumerToken: '4564',
    supplierDeals: '231',
    supplierAvgTime: '12351',
    supplierToken: '329',
    my: true,
};

export class Profile extends React.PureComponent<IProps, never> {
    public render() {
        return (
            <ProfileView
                className=""
                getUiText={p.getUiText}
                definitionList={p.definitionList}
                certificates={p.certificates}
                description={p.description}
                consumerDeals={p.consumerDeals}
                consumerAvgTime={p.consumerAvgTime}
                consumerToken={p.consumerToken}
                supplierDeals={p.supplierDeals}
                supplierAvgTime={p.supplierAvgTime}
                supplierToken={p.supplierToken}
                my={p.my}
            />
        );
    }
}

export default Profile;
