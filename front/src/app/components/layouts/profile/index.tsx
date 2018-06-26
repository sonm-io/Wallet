import * as React from 'react';
import { ProfileView } from './view';
import rootStore from 'app/stores';

interface IProps {
    className?: string;
    onNavigateToOrders: (address: string) => void;
}

const returnFirstArg = (...as: any[]) => String(as[0]);

export class Profile extends React.PureComponent<IProps, never> {
    protected handleClickKYC = async () => {
        // TODO redirect to kyc
    };

    public render() {
        const props = this.props;
        const store = rootStore.profileDetailsStore;
        const profile = store.profile;

        return (
            <ProfileView
                certificates={store.certificates}
                getUiText={returnFirstArg}
                className={props.className}
                definitionList={profile.attributes}
                description={profile.description}
                consumerDeals="0"
                consumerAvgTime="1"
                consumerToken="2"
                supplierDeals="3"
                supplierAvgTime="4"
                supplierToken="5"
                my={
                    profile.address.toLowerCase() ===
                    rootStore.marketStore.marketAccountAddress.toLowerCase()
                }
                userName={profile.name}
                countryAbCode2={profile.country}
                logoUrl={profile.logoUrl}
                userStatus={profile.status || 0}
                address={profile.address}
                onNavigateToOrders={props.onNavigateToOrders}
                onClickKYC={this.handleClickKYC}
            />
        );
    }
}

export default Profile;
