import * as React from 'react';
import { ProfileView } from './view';

interface IProps {
    className?: string;
    style?: any;
}

const returnFirstArg = (...as: any[]) => String(as[0]);
const p = {
    countryAbbr: 'BL',
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
        {
            label: 'Olololo',
            value: 'yo yo man',
        },
        {
            label: 'asdfg',
            value: 'etrytui',
        },
        {
            label: '776ugh',
            value: 'liurn',
        },
        {
            label: '90877',
            value: 'rrdtfygh',
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
    userName: 'USER NAME',
    country: 'bl',
    logoUrl:
        'http://cdn.thecoolist.com/wp-content/uploads/2016/05/Japanese-Cherry-beautiful-tree-960x540.jpg',
    userStatus: 2,
    address: '0x1234567890123456789012345678901234567890',
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
                userName={p.userName}
                countryAbCode2={p.countryAbbr}
                logoUrl={p.logoUrl}
                userStatus={p.userStatus}
                address={p.address}
                style={this.props.style}
            />
        );
    }
}

export default Profile;
