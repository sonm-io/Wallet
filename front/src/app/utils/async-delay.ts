export async function delay(interval: number) {
    return new Promise(x => setTimeout(x, interval));
}

export default delay;
