import { computed } from 'mobx';
import { SendStore } from './send';
import { moveDecimalPoint } from '../utils/move-decimal-point';

export class WithdrawStore extends SendStore {
    @computed
    get currentBalanceMaximum(): string {
        return moveDecimalPoint(this.currentBalanceMaximumWei, -18, 4);
    }

    @computed
    get currentBalanceMaximumWei() {
        return this.rootStore.myProfiles.current
            ? this.rootStore.myProfiles.current.marketBalance
            : '0';
    }
}

export default WithdrawStore;

export * from './types';
