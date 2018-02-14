declare module 'worker/*' {
    function factory(): Worker;
    namespace factory {

    }
    export = factory;
}
