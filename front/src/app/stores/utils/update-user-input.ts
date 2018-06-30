interface IStoreWithUserInput<T> {
    userInput: Partial<T>;
}

export function updateUserInput<TUserInput>(
    store: IStoreWithUserInput<TUserInput>,
    values: Partial<TUserInput>,
) {
    const keys = Object.keys(values) as Array<keyof TUserInput>;

    keys.forEach(key => {
        if (!(key in store.userInput)) {
            throw new Error(`Unknown user input ${key}`);
        }

        if (values[key] !== undefined) {
            store.userInput[key] = values[key];
        }
    });
}
