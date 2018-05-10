import * as React from 'react';
import { ProfileView } from './view';
import { Api } from 'app/api';
import { IProfileFull, EnumProfileStatus } from 'app/api/types';
import { rootStore } from '../../../stores';

interface IProps {
    className?: string;
    address: string;
}

interface IState {
    profile: IProfileFull;
}

const returnFirstArg = (...as: any[]) => String(as[0]);

export class Profile extends React.PureComponent<IProps, IState> {
    protected static readonly emptyProfile: IProfileFull = {
        attributes: [],
        name: '',
        address: '0x0',
        status: EnumProfileStatus.anonimest,
        sellOrders: 0,
        buyOrders: 0,
        deals: 0,
        country: '',
        logoUrl: '',
    };

    public state = {
        profile: Profile.emptyProfile,
    };

    public componentDidMount() {
        this.fetchData();
    }

    protected async fetchData() {
        const profile = await Api.profile.fetchByAddress(this.props.address);

        this.setState({
            profile,
        });
    }

    public render() {
        const props = this.props;
        const profile = this.state.profile;

        return (
            <ProfileView
                getUiText={returnFirstArg}
                className={props.className}
                definitionList={profile.attributes}
                certificates={[]}
                description={''}
                consumerDeals="0"
                consumerAvgTime="1"
                consumerToken="2"
                supplierDeals="3"
                supplierAvgTime="4"
                supplierToken="5"
                my={
                    props.address === rootStore.marketStore.marketAccountAddress
                }
                userName={profile.name}
                countryAbCode2={profile.country}
                logoUrl={profile.logoUrl}
                userStatus={profile.status}
                address={profile.address}
            />
        );
    }
}

export default Profile;
