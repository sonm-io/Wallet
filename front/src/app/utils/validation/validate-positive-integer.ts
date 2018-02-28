const digitsRegex = /^\d+$/;

export function validatePositiveInteger(value: string): string[] {
    const result = [];

    if (value === '') {
        result.push('required_value');
    } else {
        if (!digitsRegex.test(value)) {
            result.push('should_be_positive_integer');
        }
    }

    return result;
}

export default validatePositiveInteger;
