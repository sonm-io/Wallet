const regex = /(0+)$|\.(0+)$/;

export function trimZeros(value: any): string {
    const v = String(value).replace(/^(0+)/, '');

    if (v.indexOf('.') === -1) {
        return v;
    }

    return String(value).replace(regex, '');
}

export default trimZeros;
