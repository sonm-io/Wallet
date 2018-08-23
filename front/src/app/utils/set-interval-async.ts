class IntervalTask {
    protected activeValue = true;

    public timeoutId: number = 0;

    public get isActive() {
        return this.activeValue;
    }

    public stop = () => {
        this.activeValue = false;
        window.clearTimeout(this.timeoutId);
    };
}

const call = async (
    asyncFn: (...args: any[]) => Promise<void>,
    interval: number,
    task: IntervalTask,
    args: any[],
) => {
    if (task.isActive) {
        await asyncFn(...args);
    }
    if (task.isActive) {
        task.timeoutId = window.setTimeout(
            () => call(asyncFn, interval, task, args),
            interval,
        );
    }
};

export const setIntervalAsync = (
    asyncFn: (...args: any[]) => Promise<void>,
    interval: number,
    ...args: any[]
) => {
    const task = new IntervalTask();
    call(asyncFn, interval, task, args);
    return task;
};
