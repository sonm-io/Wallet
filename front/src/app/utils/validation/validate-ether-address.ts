export function validateHex(length: number, value: string): any[] {
    const result = [];
    const regex = new RegExp(`^(0x)?[0-9a-fA-F]{${length}}$`, 'i');

    if (!regex.test(value)) {
        result.push(['should_be_hex', [length]]);
    }

    return result;
}

export const validateEtherAddress = (x: string): any[] =>
    validateHex(40, x).length ? ['should_be_ether_address'] : [];
