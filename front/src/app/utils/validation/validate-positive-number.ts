const digitsRegex = /^\d+$/;

export function validatePositiveNumber(
    value: string,
    dotSymbol = '.',
): string[] {
    const result = [];

    if (value === '') {
        result.push('required_value');
    } else {
        const [a, b = '0'] = value.split(dotSymbol);
        if (digitsRegex.test(a) && digitsRegex.test(b)) {
            if (Number(a) === 0 && Number(b) === 0) {
                result.push('should_be_positive_number');
            }
        } else {
            result.push('should_be_positive_number');
        }
    }

    return result;
}

export default validatePositiveNumber;
