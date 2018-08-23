interface IIntervalTask {
    timeoutId: number;
    isActive: boolean;
    stop: (this: IIntervalTask) => void;
}

const call = async (
    asyncFn: (...args: any[]) => Promise<void>,
    interval: number,
    task: IIntervalTask,
    args: any[],
) => {
    await asyncFn(...args);
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
    const task: IIntervalTask = {
        timeoutId: 0,
        isActive: true,
        stop(this: IIntervalTask) {
            this.isActive = false;
            window.clearTimeout(this.timeoutId);
        },
    };
    call(asyncFn, interval, task, args);
    return task;
};
