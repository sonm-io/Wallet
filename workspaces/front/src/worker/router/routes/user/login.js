import TheSession from 'worker/api/the-session';

export async function login({ params, resolve, reject, validation }) {
  const {
    gethNodeUrl,
    privateJson,
    password,
  } = params;

  try {
    await TheSession.login(gethNodeUrl, privateJson, password);

  } catch (e) {
    reject(e);
  }

  resolve({
    address: TheSession.walletOwnerProfile.getAddress(),
  });
}