import * as React from 'react';
import { ProfileView } from './view';
import * as lands from './lands-utils';

interface IProps {
    className?: string;
}

const mapAbbrToCountry = lands.getMap();

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
};

function getCountryFlagUrl(countryAbbr: string) {
    return `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/flags/4x3/${countryAbbr}.svg`;
}

export class Profile extends React.PureComponent<IProps, never> {
    public static defaultCountry: lands.ILand = {
        name: 'Democratic Republic of Nowhere',
        abCode2: 'KZ',
        abCode3: 'NWE',
        isoNumber: '777',
        phoneCode: '+7-777',
        domain: '.nowhere',
    };

    public render() {
        const country =
            mapAbbrToCountry[p.countryAbbr] || Profile.defaultCountry;

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
                country={country ? country.name : ''}
                countryFlagUrl={getCountryFlagUrl(p.countryAbbr)}
                logoUrl={p.logoUrl}
            />
        );
    }
}

export default Profile;
