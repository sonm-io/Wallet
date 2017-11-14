declare module 'ethereum-blockies' {
  interface IParams {
      seed: string | undefined;
  }
  function create(params: IParams): HTMLCanvasElement;
  export { create };
}
