declare module 'ethereum-blockies' {
    interface IParams {
        seed: string | undefined;
    }
    function create(params: IParams): HTMLCanvasElement;
    function render(params: IParams, target: HTMLCanvasElement): void;
    export { create, render };
}
