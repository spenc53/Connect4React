declare module 'comlink-loader!*' {
    class WebpackWorker extends Worker {
        constructor();

        processData(data: any): Promise<number>;
    }

    export = WebpackWorker;
}