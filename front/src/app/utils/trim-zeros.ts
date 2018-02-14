const regex = /(0+)$|\.(0+)$/;

export function trimZeros(value: any): string {
    const v = String(value);

    if (v.indexOf('.') === -1) {
        return v;
    }

    return String(value).replace(regex, '');
}

export default trimZeros;
