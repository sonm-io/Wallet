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

declare module 'lodash/fp/debounce' {
    function debounce(time: number): (fn: Function) => any;
    namespace debounce {}
    export = debounce;
}

declare module 'lodash/fp/capitalize' {
    function capitalize(s: string): string;
    namespace capitalize {}
    export = capitalize;
}
