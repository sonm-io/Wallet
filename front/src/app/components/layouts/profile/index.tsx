import * as React from 'react';
import { ProfileView } from './view';
import rootStore from 'app/stores';
import { observer } from 'mobx-react';

interface IProps {
    className?: string;
    onNavigateToOrders: (address: string) => void;
    onNavigateToKyc: () => void;
}

const returnFirstArg = (...as: any[]) => String(as[0]);

@observer
export class Profile extends React.PureComponent<IProps, never> {
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
                onClickKYC={this.props.onNavigateToKyc}
            />
        );
    }
}

export default Profile;
