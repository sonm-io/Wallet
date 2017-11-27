declare module 'lodash/fp/get' {
  function get(path: string): (obj: any) => any;
  namespace get {}
  export = get;
}

declare module 'lodash/fp/sortBy' {
    function sortBy<T>(sortArgs: any): (iterable: T[]) => T[];
    namespace sortBy {}
    export = sortBy;
}
