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

export default new MyLocalStorage();
