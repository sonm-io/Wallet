import * as React from 'react';
import { ProfileView } from './view';
import { Api } from 'app/api';
import { IProfileBrief } from 'app/api/types';
import { rootStore } from '../../../stores';

interface IProps {
    className?: string;
    address: string;
}

interface IState {
    profile?: IProfileBrief;
    // incorrect! why brief ?
}

const returnFirstArg = (...as: any[]) => String(as[0]);

export class Profile extends React.PureComponent<IProps, IState> {
    protected async fetchData() {
        const profile = await Api.profile.fetcByAddress(this.props.address);

        this.setState({
            profile,
        });
    }

    public render() {
        const props = this.props;
        const profile = this.state.profile;

        if (profile === undefined) {
            return null;
        }

        return (
            <ProfileView
                getUiText={returnFirstArg}
                className={props.className}
                definitionList={[]}
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
