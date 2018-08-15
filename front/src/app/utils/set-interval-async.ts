import { delay } from './async-delay';

export const setIntervalAsync = async (
    asyncFn: () => Promise<void>,
    interval: number,
) => {
    await asyncFn();
    await delay(interval);
    setTimeout(() => setIntervalAsync(asyncFn, interval), 0);
};
