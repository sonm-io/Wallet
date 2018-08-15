export const setIntervalAsync = async (
    asyncFn: () => Promise<void>,
    interval: number,
) => {
    await asyncFn();
    setTimeout(() => setIntervalAsync(asyncFn, interval), interval);
};
