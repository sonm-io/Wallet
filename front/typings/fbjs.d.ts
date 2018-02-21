declare module 'fbjs/lib/invariant' {
    function invariant(
        condition: boolean,
        errorTemplate: string,
        ...templateArgumetns: any[]
    ): void;
    namespace invariant {

    }
    export = invariant;
}
