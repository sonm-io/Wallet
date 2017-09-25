export interface IApi {
  login: () => Promise<void>;
  getPrivateKeys: () => Promise<IPrivateKey | null>;
}

export interface IPrivateKey {

}

async function login() {

}

async function getPrivateKeys() {
  let result: IPrivateKey | null;

  try {
    result = window.localStorage.getItem('key');
  } catch (e) {
    result = null;
  }

  return result;
}

const api: IApi = {
  login,
  getPrivateKeys,
};

export { api };
