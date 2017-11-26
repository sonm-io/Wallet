class MyLocalStorage {
    public storage: any;

    constructor() {
        this.storage = localStorage;
    }

    public get(key: string): any {
        return this.storage.getItem(key);
    }

    public set(key: string, value: any): boolean {
        return this.storage.setItem(key, value);
    }
}

const storage = new MyLocalStorage();

module.exports = function init(worker: any) {
    worker.addEventListener('message', (e: any) => {
        const data = e.data;

        if (data.type === 'storage') {
            let result;
            if (data.action === 'get') {
                result = storage.get(data.payload.key);
            } else if (data.action === 'set') {
                result = storage.set(data.payload.key, data.payload.value);
            }

            worker.postMessage({
                type: 'responseFromStorage',
                data: result,
            });
        }
    });
}