declare module 'lodash/fp/get' {
  function get(path: string): (obj: any) => any;
  namespace get {}
  export = get;
}

declare module 'lodash/fp/sortBy' {
    function sortBy(sortArgs: any): (obj: any[]) => any;
    namespace sortBy {}
    export = sortBy;
}
