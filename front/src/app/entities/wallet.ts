import { DEFAULT_NODES } from 'worker/api/default-nodes';
import { IWallet as IApiWallet } from 'common/types/wallet';

export interface IWallet {
    name: string;
    chainId: string;
    nodeUrl: string;

    isLivenet: boolean;
    ethNodeUrl: string;
    sidechainNodeUrl: string;
}

export class Wallet implements IWallet {
    constructor(data: IApiWallet) {
        this.name = data.name;
        this.chainId = data.chainId;
        this.nodeUrl = data.nodeUrl;
    }

    public name: string;
    public chainId: string;
    public nodeUrl: string;

    public get isLivenet() {
        return this.chainId === 'livenet';
    }

    public get ethNodeUrl() {
        return DEFAULT_NODES[this.chainId].replace('https://', '');
    }

    public get sidechainNodeUrl() {
        return DEFAULT_NODES[`${this.chainId}_private`].replace('https://', '');
    }
}

export const defaultWallet = new Wallet({
    name: '',
    chainId: '',
    nodeUrl: '',
});
