import { INodes } from './types';

const projectId = 'b5f5a2140e63435bba300424cef86b29';

export const DEFAULT_NODES: INodes = {
    default: `https://mainnet.infura.io/v3/${projectId}`,
    livenet: `https://mainnet.infura.io/v3/${projectId}`,
    livenet_private: `https://sidechain.livenet.sonm.com`,
    rinkeby: `https://rinkeby.infura.io/v3/${projectId}`,
    rinkeby_private: `https://sidechain-dev.sonm.com`,
    testrpc: `https://proxy.test.sonm.com:8545/v3/${projectId}`,
    testrpc_private: `https://proxy.test.sonm.com:8546`,
};
