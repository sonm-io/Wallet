import { DEFAULT_NODES } from 'worker/api/default-nodes';

export class Wallet {
    constructor(wallet: Partial<Wallet>) {
        Object.assign(this, wallet);
    }

    public name: string = '';
    public chainId: string = '';
    public nodeUrl: string = '';

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

export const defaultWallet = new Wallet({});

export interface IWalletList {
    version: number;
    data: Wallet[];
}
