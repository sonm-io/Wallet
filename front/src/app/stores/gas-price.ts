import { observable, action, computed } from 'mobx';
import { OnlineStore, IOnlineStoreServices } from './online-store';
const { catchErrors } = OnlineStore;
import Api from 'app/api';
import { createBigNumber, TWO, THREE } from '../utils/create-big-number';
import { trimZeros } from '../utils/trim-zeros';
import { delay } from 'app/utils/async-delay';

const UPDATE_INTERVAL = 5000;

export class GasPriceStore extends OnlineStore {
    constructor(services: IOnlineStoreServices) {
        super(services);
        this.autoUpdateIteration();
    }

    @observable public averageGasPrice = '';

    @action
    protected setAverageGasPrice(gasPrice: string = '') {
        this.averageGasPrice = gasPrice;
    }

    public async update() {
        const { data: gasPrice } = await Api.getGasPrice();
        this.setAverageGasPrice(gasPrice);
    }

    @computed
    public get gasPriceThresholds(): [string, string] {
        let min = '5';
        let max = '15';

        if (this.averageGasPrice !== '') {
            const bn = createBigNumber(this.averageGasPrice);

            if (bn) {
                min = trimZeros(bn.div(TWO));
                max = trimZeros(bn.mul(THREE).div(TWO));
            }
        }

        return [min, max];
    }

    @catchErrors({ restart: true })
    protected async autoUpdateIteration(interval: number = UPDATE_INTERVAL) {
        try {
            if (IS_DEV) {
                // window.console.time('auto-update');
            }

            await this.update();

            await delay(interval);

            setTimeout(() => this.autoUpdateIteration(), 0);
        } finally {
            if (IS_DEV) {
                // window.console.timeEnd('auto-update');
            }
        }
    }
}
