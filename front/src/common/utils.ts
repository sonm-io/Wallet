const digitsRegex = /^[0-9]+$/;
export const isDigits = (x: string) => digitsRegex.test(x);

const hexDeximalRegex = /^(0x)?[a-f0-9]+$/i;
export const isHexDeximal = (x: string) => hexDeximalRegex.test(x);
