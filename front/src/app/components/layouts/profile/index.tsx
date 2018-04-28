import * as React from 'react';
import { ProfileView } from './view';
import { Api } from 'app/api';
import { IProfileBrief } from 'app/api/types';

interface IProps {
    className?: string;
    style?: any;
    initialAddress: string;
}

const returnFirstArg = (...as: any[]) => String(as[0]);
const p = {
    countryAbbr: 'BL',
    getUiText: returnFirstArg,
    attributes: [
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

export class Profile extends React.PureComponent<IProps, any> {
    public state = {
        profile: {} as IProfileBrief,
    };

    constructor(props: IProps) {
        super(props);

        Api.getProfile(props.initialAddress).then(response => {
            this.setState({ profile: response.data as IProfileBrief });
        });
    }

    public render() {
        const profile = this.state.profile;

        console.log(profile);

        return (
            <ProfileView
                className=""
                getUiText={p.getUiText}
                definitionList={profile.attributes || []}
                certificates={p.certificates}
                description={p.description}
                consumerDeals={p.consumerDeals}
                consumerAvgTime={p.consumerAvgTime}
                consumerToken={p.consumerToken}
                supplierDeals={p.supplierDeals}
                supplierAvgTime={p.supplierAvgTime}
                supplierToken={p.supplierToken}
                my={p.my}
                userName={profile.name || ''}
                countryAbCode2={profile.country || ''}
                logoUrl={p.logoUrl}
                userStatus={profile.status}
                address={profile.address || ''}
                style={this.props.style}
            />
        );
    }
}

export default Profile;
