import * as React from 'react';
import { ProfileView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';

interface IProps {
    className?: string;
    onNavigateToOrders: (address: string) => void;
    onNavigateToKyc: () => void;
}

const returnFirstArg = (...as: any[]) => String(as[0]);

@observer
export class Profile extends React.Component<IProps, never> {
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
                consumerDeals="--"
                consumerAvgTime="--"
                consumerToken="--"
                supplierDeals="--"
                supplierAvgTime="--"
                supplierToken="--"
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
                onNavigateToKyc={this.props.onNavigateToKyc}
            />
        );
    }
}

export default Profile;
