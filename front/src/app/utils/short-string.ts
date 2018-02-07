export function shortString(str: string, maxLen: number) {
    let result = str;

    const len = result.length;
    if (len > maxLen) {
        const half = Math.floor(maxLen / 2) - 1;
        result = str.slice(0, half) + '...' + str.slice(len - half);
    }

    return result;
}

export default shortString;
