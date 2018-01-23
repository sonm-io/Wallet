const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/i;

export function validateEtherAddress(value: string): string[] {
    const result = [];

    if (!ADDRESS_REGEX.test(value)) {
        result.push('Please input correct address');
    }

    return result;
}
