export interface IApi {
  login: () => void;
}

const api: IApi = {
  login() {
    console.log('api login');
  },
};

export { api };
