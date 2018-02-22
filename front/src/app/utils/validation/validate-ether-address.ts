const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/i;

export function validateEtherAddress(value: string): string[] {
    const result = [];

    if (!ADDRESS_REGEX.test(value)) {
        result.push('should_be_ether_address');
    }

    return result;
}
