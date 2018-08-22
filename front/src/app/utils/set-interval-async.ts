class IntervalTask {
    protected activeValue = true;

    public get isActive() {
        return this.activeValue;
    }

    public stop = () => {
        this.activeValue = false;
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
        setTimeout(() => call(asyncFn, interval, task, args), interval);
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
