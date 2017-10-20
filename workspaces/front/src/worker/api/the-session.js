import sonmApi from '../../../../sonm-api';
import keythereum from '../../../vendor/keythereum.min';

const { createProfile, createGethClient, createProvider } = sonmApi;
const recoverKey = (password, params) => new Promise(done => keythereum.recover(password, params, done));

let walletOwnerProfile;
let gethClient;
let gethProvider;

const session = {
  get gethClient() {
    return gethClient;
  },
  get walletOwnerProfile() {
    return walletOwnerProfile;
  },
  get gethProvider() {
    return gethProvider;
  },
};

export default session;

export async function login(gethNodeUrl, privateJson, password) {
  const privateKey = await recoverKey(password, privateJson);

  gethProvider = createProvider(gethNodeUrl, privateJson.address, privateKey);
  gethClient = createGethClient(gethProvider);

  walletOwnerProfile = createProfile(gethNodeUrl, privateJson.address, privateKey);
}

